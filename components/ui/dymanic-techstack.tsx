"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface TechStackSelectorProps {
    project: { techStack: string };
    addTechStack: (tech: string) => void;
    removeTech: (tech: string) => void;
}

interface Technology {
    value: string;
    label: string;
}

const TechStackSelector: React.FC<TechStackSelectorProps> = ({ project, addTechStack, removeTech }) => {
    const [technologies, setTechnologies] = useState<Technology[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchTechnologies = async () => {
            try {
                const response = await fetch("https://api.github.com/search/topics?q=language", {
                    headers: { Accept: "application/vnd.github.mercy-preview+json" },
                });
                if (!response.ok) throw new Error("Failed to fetch technologies");

                const data = await response.json();
                const topics = data.items.map((item: { name: string }) => ({
                    value: item.name,
                    label: item.name,
                }));

                setTechnologies(topics);
            } catch (error) {
                console.error("Error fetching technologies:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTechnologies();
    }, []);

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2 mb-2">
                {(project.techStack || "").split(",").map((tech, index) =>
                    tech.trim() ? (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {tech.trim()}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 hover:bg-transparent"
                                onClick={() => removeTech(tech.trim())}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    ) : null
                )}
            </div>

            <Select onValueChange={(value) => addTechStack(value)}>
                <SelectTrigger>
                    <SelectValue placeholder={loading ? "Loading..." : "Add technologies..."} />
                </SelectTrigger>
                <SelectContent>
                    {loading ? (
                        <SelectItem value="loading" disabled>
                            Loading...
                        </SelectItem>
                    ) : technologies.length > 0 ? (
                        technologies.map((tech) => (
                            <SelectItem key={tech.value} value={tech.value}>
                                {tech.label}
                            </SelectItem>
                        ))
                    ) : (
                        <SelectItem value="no-results" disabled>
                            No technologies found
                        </SelectItem>
                    )}
                </SelectContent>

            </Select>
        </div>
    );
};

export default TechStackSelector;
