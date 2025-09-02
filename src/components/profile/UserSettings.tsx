"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Palette, 
  Lock,
  Eye,
  EyeOff,
  Camera,
  Link as LinkIcon,
  Trash2,
  Download,
  Smartphone,
  LogOut,
  Zap,
  BarChart3
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { useTheme } from "@/contexts/ThemeContext"
import { PerformanceOptimizer } from "../performance/PerformanceOptimizer"
import { AnalyticsDashboard } from "../analytics/AnalyticsDashboard"
import { cn } from "@/lib/utils"

interface UserSettingsProps {
  onClose?: () => void
}

export function UserSettings({ onClose }: UserSettingsProps) {
  const { user, updateUser, logout } = useAuth()
  const { setTheme, resolvedTheme } = useTheme()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("profile")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Profile settings
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    username: user?.username || "",
    bio: user?.bio || "",
    location: user?.location || "",
    website: user?.website || "",
    instagram: user?.instagram || "",
    twitter: user?.twitter || "",
    email: user?.email || ""
  })

  // Privacy settings
  const [privacyForm, setPrivacyForm] = useState({
    privateAccount: false,
    showActivityStatus: true,
    allowDirectMessages: true,
    showOnlineStatus: true,
    allowTagging: true,
    allowComments: true
  })

  // Notification settings
  const [notificationForm, setNotificationForm] = useState({
    emailNotifications: true,
    pushNotifications: true,
    likeNotifications: true,
    commentNotifications: true,
    followNotifications: true,
    mentionNotifications: true,
    messageNotifications: true
  })

  // App settings
  const [appForm, setAppForm] = useState({
    language: "en",
    theme: resolvedTheme || "system",
    autoPlayVideos: true,
    dataSaver: false,
    highQualityUploads: true
  })

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (user) {
        updateUser({
          ...user,
          ...profileForm
        })
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Please try again later.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSavePrivacy = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Privacy settings updated",
        description: "Your privacy settings have been saved."
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Please try again later.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveNotifications = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Notification settings updated",
        description: "Your notification preferences have been saved."
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Please try again later.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveAppSettings = async () => {
    setIsLoading(true)
    try {
      // Apply theme change
      if (appForm.theme !== resolvedTheme) {
        setTheme(appForm.theme as "light" | "dark" | "system")
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "App settings updated",
        description: "Your app preferences have been saved."
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Please try again later.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadData = () => {
    toast({
      title: "Data download",
      description: "Your data download will begin shortly."
    })
  }

  const handleDeleteAccount = () => {
    toast({
      title: "Delete account",
      description: "This feature is not available in demo mode.",
      variant: "destructive"
    })
  }

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged out",
      description: "You have been successfully logged out."
    })
    if (onClose) {
      onClose()
    }
  }

  const settingsTabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "app", label: "App Settings", icon: Smartphone },
    { id: "performance", label: "Performance", icon: Zap },
    { id: "analytics", label: "Analytics", icon: BarChart3 }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            {/* Profile Picture */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="text-xl">
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button variant="outline" size="sm" className="mb-2">
                  <Camera className="h-4 w-4 mr-2" />
                  Change Photo
                </Button>
                <p className="text-xs text-gray-500">JPG, GIF or PNG. Max 5MB.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={profileForm.username}
                  onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={profileForm.location}
                  onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                rows={3}
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={profileForm.website}
                  onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                  placeholder="https://yourwebsite.com"
                />
              </div>
              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={profileForm.instagram}
                  onChange={(e) => setProfileForm({ ...profileForm, instagram: e.target.value })}
                  placeholder="@username"
                />
              </div>
              <div>
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={profileForm.twitter}
                  onChange={(e) => setProfileForm({ ...profileForm, twitter: e.target.value })}
                  placeholder="@username"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSaveProfile} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        )

      case "privacy":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Private Account</h3>
                  <p className="text-sm text-gray-500">Only approved followers can see your content</p>
                </div>
                <Switch
                  checked={privacyForm.privateAccount}
                  onCheckedChange={(checked) => setPrivacyForm({ ...privacyForm, privateAccount: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Activity Status</h3>
                  <p className="text-sm text-gray-500">Show your activity status to others</p>
                </div>
                <Switch
                  checked={privacyForm.showActivityStatus}
                  onCheckedChange={(checked) => setPrivacyForm({ ...privacyForm, showActivityStatus: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Direct Messages</h3>
                  <p className="text-sm text-gray-500">Allow users to send you direct messages</p>
                </div>
                <Switch
                  checked={privacyForm.allowDirectMessages}
                  onCheckedChange={(checked) => setPrivacyForm({ ...privacyForm, allowDirectMessages: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Online Status</h3>
                  <p className="text-sm text-gray-500">Show when you're online</p>
                </div>
                <Switch
                  checked={privacyForm.showOnlineStatus}
                  onCheckedChange={(checked) => setPrivacyForm({ ...privacyForm, showOnlineStatus: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Tagging</h3>
                  <p className="text-sm text-gray-500">Allow others to tag you in posts</p>
                </div>
                <Switch
                  checked={privacyForm.allowTagging}
                  onCheckedChange={(checked) => setPrivacyForm({ ...privacyForm, allowTagging: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Comments</h3>
                  <p className="text-sm text-gray-500">Allow users to comment on your posts</p>
                </div>
                <Switch
                  checked={privacyForm.allowComments}
                  onCheckedChange={(checked) => setPrivacyForm({ ...privacyForm, allowComments: checked })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSavePrivacy} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        )

      case "notifications":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <Switch
                  checked={notificationForm.emailNotifications}
                  onCheckedChange={(checked) => setNotificationForm({ ...notificationForm, emailNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Push Notifications</h3>
                  <p className="text-sm text-gray-500">Receive push notifications on your device</p>
                </div>
                <Switch
                  checked={notificationForm.pushNotifications}
                  onCheckedChange={(checked) => setNotificationForm({ ...notificationForm, pushNotifications: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Likes</h3>
                  <p className="text-sm text-gray-500">When someone likes your posts</p>
                </div>
                <Switch
                  checked={notificationForm.likeNotifications}
                  onCheckedChange={(checked) => setNotificationForm({ ...notificationForm, likeNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Comments</h3>
                  <p className="text-sm text-gray-500">When someone comments on your posts</p>
                </div>
                <Switch
                  checked={notificationForm.commentNotifications}
                  onCheckedChange={(checked) => setNotificationForm({ ...notificationForm, commentNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Follows</h3>
                  <p className="text-sm text-gray-500">When someone follows you</p>
                </div>
                <Switch
                  checked={notificationForm.followNotifications}
                  onCheckedChange={(checked) => setNotificationForm({ ...notificationForm, followNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Mentions</h3>
                  <p className="text-sm text-gray-500">When someone mentions you</p>
                </div>
                <Switch
                  checked={notificationForm.mentionNotifications}
                  onCheckedChange={(checked) => setNotificationForm({ ...notificationForm, mentionNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Messages</h3>
                  <p className="text-sm text-gray-500">When you receive new messages</p>
                </div>
                <Switch
                  checked={notificationForm.messageNotifications}
                  onCheckedChange={(checked) => setNotificationForm({ ...notificationForm, messageNotifications: checked })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSaveNotifications} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        )

      case "app":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="language">Language</Label>
                <Select value={appForm.language} onValueChange={(value) => setAppForm({ ...appForm, language: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="it">Italiano</SelectItem>
                    <SelectItem value="pt">Português</SelectItem>
                    <SelectItem value="zh">中文</SelectItem>
                    <SelectItem value="ja">日本語</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="theme">Theme</Label>
                <Select value={appForm.theme} onValueChange={(value) => setAppForm({ ...appForm, theme: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Auto-play Videos</h3>
                  <p className="text-sm text-gray-500">Automatically play videos in feed</p>
                </div>
                <Switch
                  checked={appForm.autoPlayVideos}
                  onCheckedChange={(checked) => setAppForm({ ...appForm, autoPlayVideos: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Data Saver</h3>
                  <p className="text-sm text-gray-500">Reduce data usage by loading lower quality media</p>
                </div>
                <Switch
                  checked={appForm.dataSaver}
                  onCheckedChange={(checked) => setAppForm({ ...appForm, dataSaver: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">High Quality Uploads</h3>
                  <p className="text-sm text-gray-500">Upload photos and videos in high quality</p>
                </div>
                <Switch
                  checked={appForm.highQualityUploads}
                  onCheckedChange={(checked) => setAppForm({ ...appForm, highQualityUploads: checked })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSaveAppSettings} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        )

      case "performance":
        return <PerformanceOptimizer />

      case "analytics":
        return <AnalyticsDashboard />

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {settingsTabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                        activeTab === tab.id && "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" onClick={handleDownloadData}>
                <Download className="h-4 w-4 mr-2" />
                Download My Data
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={handleDeleteAccount}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {(() => {
                  const activeTabData = settingsTabs.find(tab => tab.id === activeTab)
                  if (activeTabData?.icon) {
                    const Icon = activeTabData.icon
                    return <Icon className="h-5 w-5" />
                  }
                  return null
                })()}
                {settingsTabs.find(tab => tab.id === activeTab)?.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderTabContent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}