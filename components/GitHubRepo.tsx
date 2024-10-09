'use client';
import React, { useEffect, useState } from 'react';
import { IoLogoGithub } from 'react-icons/io';
import { CgSpinner } from 'react-icons/cg';
import { FiSearch } from 'react-icons/fi';  

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string;
}

interface GitHubRepoListProps {
  onRepoSelect: (repo: GitHubRepo) => void;
}

const GitHubRepoList: React.FC<GitHubRepoListProps> = ({ onRepoSelect }) => {
  const [gitHubRepos, setGitHubRepos] = useState<GitHubRepo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [loadingRepos, setLoadingRepos] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchRepos = async () => {
    try {
      const response = await fetch('/api/github/repos');
      const data = await response.json();
      setGitHubRepos(data);
      setError(null); // Clear error if any
    } catch (err) {
      setError('Could not fetch repositories from GitHub.');
    } finally {
      setLoadingRepos(false);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  const filteredRepos = gitHubRepos.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center justify-center  p-6">
      <div className="bg-background text-gray-100 shadow-xl rounded-lg border border-gray-700 w-full max-w-lg p-6">
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        
        {loadingRepos ? (
          <div className="flex flex-col items-center justify-center h-40">
            <CgSpinner className="animate-spin h-6 w-6 mb-2 text-gray-400" />
            <span>Fetching your public repos ...</span>
          </div>
        ) : (
          <>
            <h3 className="text-2xl font-bold mb-4 text-center text-gray-200">Select a Repository</h3>
            
            {/* Search input */}
            <div className="relative mb-4">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FiSearch className="text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Search for repo..."
                className="pl-10 p-3 w-full border rounded-md border-gray-600 bg-black text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-gray-500 transition duration-200"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="max-h-64 w-full overflow-y-auto mb-4 space-y-2 scrollbar-hide">
              {filteredRepos.map((repo) => (
                <button
                  key={repo.id}
                  className={`flex items-start space-x-4 p-4 text-left rounded-lg w-full shadow-md 
                              ${selectedRepo?.id === repo.id 
                                ? 'border-green-500 bg-green-600/10' 
                                : 'hover:bg-gray-900'} transition-all duration-300`}
                  onClick={() => setSelectedRepo(repo)}
                >
                  <div>
                    <IoLogoGithub className={`h-8 w-8 text-gray-400 transition duration-200 
                                              ${selectedRepo?.id === repo.id ? 'text-green-400' : 'hover:text-gray-300'}`} />
                  </div>
                  <div className="flex w-full flex-col">
                    <span className={`font-medium transition duration-200 text-gray-100
                                     ${selectedRepo?.id === repo.id ? 'text-green-400' : 'hover:text-gray-300'}`}>
                      {repo.name}
                    </span>
                    <span className="text-xs font-medium text-gray-500">
                      {repo.full_name}
                    </span>
                    <span className="mt-1 text-sm text-gray-400 line-clamp-3">
                      {repo.description}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className='mt-6'>
              <button
                className={`w-full py-3 px-6 bg-green-600 text-gray-100 font-semibold rounded-md shadow-md transition-all duration-300 
                ease-in-out transform hover:bg-green-700 hover:shadow-lg hover:-translate-y-1 
                ${!selectedRepo ? 'opacity-50 cursor-not-allowed ' : ''}`}
                onClick={() => selectedRepo && onRepoSelect(selectedRepo)}
                disabled={!selectedRepo}
              >
                {selectedRepo ? 'Import Selected Repository' : 'Select Repository'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GitHubRepoList;
