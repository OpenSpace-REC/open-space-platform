'use client';
import React from 'react';

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";


import { Button } from "@/components/ui/button";
import { GitPullRequest, Star } from "lucide-react";


export default function ProjectCard ({ project })  {

    return(

    <Card className=" bg-card text-white border border-white/10">
      <CardHeader>
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{project.name}</h3>
          <Badge variant="outline" className="border-white/50 text-white">{project.language}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-white/70 mb-4">{project.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="flex items-center space-x-1 border-white/30">
              <GitPullRequest size={14} />
              <span>{project.pullRequests}</span>
            </Badge>
            <Badge variant="outline" className="flex items-center space-x-1 border-white/30">
              <Star size={14} />
              <span>{project.stars}</span>
            </Badge>
          </div>
          <Button variant="outline" size="sm" className="text-white border-white/30 hover:bg-white/10">View Project</Button>
        </div>
      </CardContent>
    </Card>
    )
};