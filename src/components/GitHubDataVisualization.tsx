
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer 
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent
} from "@/components/ui/chart";

// Type definitions for repository data
type RepoStatsData = {
  name: string;
  stars: number;
  forks: number;
  issues: number;
  commits: number;
  date: string;
};

type CommitActivity = {
  week: string;
  commits: number;
};

type ContributorStats = {
  name: string;
  commits: number;
  additions: number;
  deletions: number;
};

type LanguageStats = {
  name: string;
  percentage: number;
};

type GitHubData = {
  repoStats: RepoStatsData[];
  commitActivity: CommitActivity[];
  contributors: ContributorStats[];
  languages: LanguageStats[];
  lastUpdated: string;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

const GitHubDataVisualization: React.FC = () => {
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<string>("main");
  
  // Fetch data from summary.json file
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First, fetch the summary data to get available repositories
      const summaryResponse = await fetch('/data/summary.json');
      if (!summaryResponse.ok) {
        throw new Error('Failed to load summary data');
      }
      
      const summaryData = await summaryResponse.json();
      
      // Mock GitHub data based on our simulation data
      // In a real implementation, you would fetch this from GitHub API
      const mockGitHubData: GitHubData = {
        repoStats: summaryData.simulations.map((sim: string, index: number) => ({
          name: sim,
          stars: 10 + Math.floor(Math.random() * 90),
          forks: 5 + Math.floor(Math.random() * 45),
          issues: Math.floor(Math.random() * 20),
          commits: 50 + Math.floor(Math.random() * 200),
          date: new Date(Date.now() - index * 86400000).toISOString().split('T')[0]
        })),
        commitActivity: Array.from({ length: 10 }, (_, i) => ({
          week: `Week ${i+1}`,
          commits: 10 + Math.floor(Math.random() * 40)
        })),
        contributors: [
          { name: "User 1", commits: 120, additions: 3500, deletions: 1200 },
          { name: "User 2", commits: 80, additions: 2200, deletions: 800 },
          { name: "User 3", commits: 65, additions: 1800, deletions: 600 },
          { name: "User 4", commits: 40, additions: 1100, deletions: 400 },
          { name: "User 5", commits: 25, additions: 700, deletions: 200 },
        ],
        languages: [
          { name: "TypeScript", percentage: 45 },
          { name: "JavaScript", percentage: 25 },
          { name: "Python", percentage: 15 },
          { name: "CSS", percentage: 10 },
          { name: "HTML", percentage: 5 }
        ],
        lastUpdated: new Date().toLocaleString()
      };
      
      setData(mockGitHubData);
      toast.success("GitHub data loaded successfully");
      
    } catch (err) {
      console.error('Error loading GitHub data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load GitHub data');
      toast.error("Failed to load GitHub data");
    } finally {
      setLoading(false);
    }
  };

  // Load data on initial render
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>GitHub Repository Analytics</CardTitle>
            <CardDescription>
              Track repository statistics, commits, and contributor activity
            </CardDescription>
          </div>
          <Button variant="outline" size="icon" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading && <p className="text-center py-4">Loading GitHub data...</p>}
        
        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md my-2 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}
        
        {!loading && !error && data && (
          <>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
              <div>
                <p className="text-sm font-medium mb-1">Last Updated:</p>
                <p className="text-sm text-muted-foreground">
                  {data.lastUpdated}
                </p>
              </div>
              
              <div className="sm:ml-auto">
                <p className="text-sm font-medium mb-1">Select Repository:</p>
                <Select value={selectedRepo} onValueChange={setSelectedRepo}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select repository" />
                  </SelectTrigger>
                  <SelectContent>
                    {data.repoStats.map((repo) => (
                      <SelectItem key={repo.name} value={repo.name}>
                        {repo.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="commits">Commits</TabsTrigger>
                <TabsTrigger value="contributors">Contributors</TabsTrigger>
                <TabsTrigger value="languages">Languages</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
                  {data.repoStats.find(r => r.name === selectedRepo) && (
                    <>
                      <Card>
                        <CardHeader className="py-2">
                          <CardTitle className="text-sm">Stars</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">{data.repoStats.find(r => r.name === selectedRepo)?.stars}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="py-2">
                          <CardTitle className="text-sm">Forks</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">{data.repoStats.find(r => r.name === selectedRepo)?.forks}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="py-2">
                          <CardTitle className="text-sm">Issues</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">{data.repoStats.find(r => r.name === selectedRepo)?.issues}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="py-2">
                          <CardTitle className="text-sm">Commits</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">{data.repoStats.find(r => r.name === selectedRepo)?.commits}</p>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>
                
                <div className="h-[300px] mt-4">
                  <ChartContainer
                    config={{
                      stars: { label: "Stars", color: "#0088FE" },
                      forks: { label: "Forks", color: "#00C49F" },
                      issues: { label: "Issues", color: "#FFBB28" },
                      commits: { label: "Commits", color: "#FF8042" }
                    }}
                  >
                    <LineChart
                      data={data.repoStats}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="stars" name="Stars" stroke="#0088FE" />
                      <Line type="monotone" dataKey="forks" name="Forks" stroke="#00C49F" />
                      <Line type="monotone" dataKey="issues" name="Issues" stroke="#FFBB28" />
                      <Line type="monotone" dataKey="commits" name="Commits" stroke="#FF8042" />
                    </LineChart>
                  </ChartContainer>
                </div>
              </TabsContent>
              
              <TabsContent value="commits" className="h-[400px]">
                <ChartContainer
                  config={{
                    commits: { label: "Commits", color: "#8884d8" }
                  }}
                >
                  <BarChart
                    data={data.commitActivity}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                    />
                    <Legend />
                    <Bar dataKey="commits" name="Commits" fill="#8884d8" />
                  </BarChart>
                </ChartContainer>
              </TabsContent>
              
              <TabsContent value="contributors" className="h-[400px]">
                <ChartContainer
                  config={{
                    commits: { label: "Commits", color: "#82ca9d" },
                    additions: { label: "Additions", color: "#8884d8" },
                    deletions: { label: "Deletions", color: "#ff7300" }
                  }}
                >
                  <BarChart
                    data={data.contributors}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                    />
                    <Legend />
                    <Bar dataKey="commits" name="Commits" fill="#82ca9d" />
                    <Bar dataKey="additions" name="Additions" fill="#8884d8" />
                    <Bar dataKey="deletions" name="Deletions" fill="#ff7300" />
                  </BarChart>
                </ChartContainer>
              </TabsContent>
              
              <TabsContent value="languages" className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.languages}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="percentage"
                    >
                      {data.languages.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </>
        )}
        
        {!loading && !error && !data && (
          <div className="text-center py-6">
            <p>No GitHub data available.</p>
            <p className="text-sm text-muted-foreground mt-2">Please refresh to load the data.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GitHubDataVisualization;
