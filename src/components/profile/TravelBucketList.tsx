"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Plus, 
  Target, 
  Calendar, 
  MapPin, 
  CheckCircle2,
  Circle,
  Star,
  Trash2,
  Edit,
  Filter
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BucketListItem {
  id: string
  title: string
  description: string
  location: string
  country: string
  category: string
  priority: "high" | "medium" | "low"
  targetDate?: string
  isCompleted: boolean
  createdAt: string
  notes?: string
}

const mockBucketList: BucketListItem[] = [
  {
    id: "1",
    title: "Visit Machu Picchu",
    description: "Explore the ancient Incan citadel in the Andes Mountains",
    location: "Cusco",
    country: "Peru",
    category: "Adventure",
    priority: "high",
    targetDate: "2024-12-31",
    isCompleted: false,
    createdAt: "2024-01-01",
    notes: "Need to book flights and hiking tour in advance"
  },
  {
    id: "2",
    title: "Northern Lights in Iceland",
    description: "Witness the aurora borealis in the Icelandic wilderness",
    location: "Reykjavik",
    country: "Iceland",
    category: "Nature",
    priority: "high",
    targetDate: "2024-11-30",
    isCompleted: false,
    createdAt: "2024-01-15",
    notes: "Best time to visit is September to March"
  },
  {
    id: "3",
    title: "Safari in Serengeti",
    description: "Experience the great migration and big five animals",
    location: "Serengeti National Park",
    country: "Tanzania",
    category: "Wildlife",
    priority: "medium",
    targetDate: "2025-06-30",
    isCompleted: false,
    createdAt: "2024-02-01"
  },
  {
    id: "4",
    title: "Tokyo Food Tour",
    description: "Explore authentic Japanese cuisine in Tokyo",
    location: "Tokyo",
    country: "Japan",
    category: "Food",
    priority: "medium",
    isCompleted: true,
    createdAt: "2024-01-10",
    notes: "Amazing experience! Tried ramen, sushi, and street food"
  }
]

export function TravelBucketList() {
  const { toast } = useToast()
  const [bucketList, setBucketList] = useState<BucketListItem[]>(mockBucketList)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")
  const [sortBy, setSortBy] = useState<"priority" | "date" | "title">("priority")
  
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    location: "",
    country: "",
    category: "",
    priority: "medium" as const,
    targetDate: "",
    notes: ""
  })

  const filteredItems = bucketList.filter(item => {
    if (filter === "active") return !item.isCompleted
    if (filter === "completed") return item.isCompleted
    return true
  })

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "priority") {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    }
    if (sortBy === "date") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
    return a.title.localeCompare(b.title)
  })

  const handleAddItem = () => {
    if (!newItem.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your bucket list item.",
        variant: "destructive"
      })
      return
    }

    const item: BucketListItem = {
      id: Date.now().toString(),
      title: newItem.title,
      description: newItem.description,
      location: newItem.location,
      country: newItem.country,
      category: newItem.category,
      priority: newItem.priority,
      targetDate: newItem.targetDate || undefined,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      notes: newItem.notes
    }

    setBucketList(prev => [item, ...prev])
    setNewItem({
      title: "",
      description: "",
      location: "",
      country: "",
      category: "",
      priority: "medium",
      targetDate: "",
      notes: ""
    })
    setIsAddDialogOpen(false)
    
    toast({
      title: "Added to bucket list",
      description: "Your new travel goal has been added successfully."
    })
  }

  const handleToggleComplete = (id: string) => {
    setBucketList(prev => prev.map(item => 
      item.id === id 
        ? { ...item, isCompleted: !item.isCompleted }
        : item
    ))
    
    const item = bucketList.find(i => i.id === id)
    if (item) {
      toast({
        title: item.isCompleted ? "Marked as active" : "Completed!",
        description: item.isCompleted 
          ? "Item moved back to active goals"
          : `Congratulations on completing "${item.title}"!`
      })
    }
  }

  const handleDeleteItem = (id: string) => {
    setBucketList(prev => prev.filter(item => item.id !== id))
    toast({
      title: "Item deleted",
      description: "Bucket list item has been removed."
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "low": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const completedCount = bucketList.filter(item => item.isCompleted).length
  const totalCount = bucketList.length
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="space-y-4">
      {/* Header with Stats */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5" />
              Travel Bucket List
            </CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Goal
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Travel Goal</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={newItem.title}
                      onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Visit Paris"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newItem.description}
                      onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your travel goal..."
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={newItem.location}
                        onChange={(e) => setNewItem(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={newItem.country}
                        onChange={(e) => setNewItem(prev => ({ ...prev, country: e.target.value }))}
                        placeholder="Country"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={newItem.category}
                        onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="e.g., Adventure"
                      />
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <select
                        id="priority"
                        value={newItem.priority}
                        onChange={(e) => setNewItem(prev => ({ ...prev, priority: e.target.value as any }))}
                        className="w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="targetDate">Target Date (Optional)</Label>
                    <Input
                      id="targetDate"
                      type="date"
                      value={newItem.targetDate}
                      onChange={(e) => setNewItem(prev => ({ ...prev, targetDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={newItem.notes}
                      onChange={(e) => setNewItem(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Additional notes..."
                      rows={2}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddItem}>
                      Add Goal
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {totalCount}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Total Goals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {completedCount}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {completionPercentage}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Progress</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Sorting */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filter:</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
                className="h-8"
              >
                All ({totalCount})
              </Button>
              <Button
                variant={filter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("active")}
                className="h-8"
              >
                Active ({totalCount - completedCount})
              </Button>
              <Button
                variant={filter === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("completed")}
                className="h-8"
              >
                Completed ({completedCount})
              </Button>
            </div>
            
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-8 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800"
              >
                <option value="priority">Priority</option>
                <option value="date">Date Added</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bucket List Items */}
      <div className="space-y-3">
        {sortedItems.map((item) => (
          <Card key={item.id} className={`transition-all duration-200 ${
            item.isCompleted 
              ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' 
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          }`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleToggleComplete(item.id)}
                  className="mt-1 flex-shrink-0"
                >
                  {item.isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  )}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium ${
                        item.isCompleted 
                          ? 'text-green-700 dark:text-green-300 line-through' 
                          : 'text-gray-900 dark:text-gray-100'
                      }`}>
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className={`text-sm mt-1 ${
                          item.isCompleted 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {item.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getPriorityColor(item.priority)}`}
                      >
                        <Star className="h-3 w-3 mr-1" />
                        {item.priority}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {item.location && item.country && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{item.location}, {item.country}</span>
                      </div>
                    )}
                    {item.targetDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Target: {new Date(item.targetDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    {item.category && (
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    )}
                  </div>
                  
                  {item.notes && (
                    <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs text-gray-600 dark:text-gray-400">
                      {item.notes}
                    </div>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteItem(item.id)}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {sortedItems.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No travel goals yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {filter === "completed" 
                  ? "You haven't completed any travel goals yet."
                  : "Start planning your next adventure by adding a travel goal!"
                }
              </p>
              {filter !== "completed" && (
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Goal
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}