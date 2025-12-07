'use client';

import { useState } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pin, Edit, Trash2, Search, PinOff } from 'lucide-react';
import { mockAnnouncements, mockSections } from '@/lib/mockData';
import type { Announcement } from '@/types';
import { toast } from 'sonner';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [searchTerm, setSearchTerm] = useState('');
  const [sectionFilter, setSectionFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    sectionId: '',
    isPinned: false,
  });

  const filteredAnnouncements = announcements
    .filter((announcement) => {
      const matchesSearch =
        announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSection = sectionFilter === 'all' || announcement.sectionId === sectionFilter;
      
      return matchesSearch && matchesSection;
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const handleOpenDialog = (announcement?: Announcement) => {
    if (announcement) {
      setEditingAnnouncement(announcement);
      setFormData({
        title: announcement.title,
        content: announcement.content,
        sectionId: announcement.sectionId,
        isPinned: announcement.isPinned,
      });
    } else {
      setEditingAnnouncement(null);
      setFormData({
        title: '',
        content: '',
        sectionId: '',
        isPinned: false,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAnnouncement) {
      setAnnouncements(announcements.map(a => 
        a.id === editingAnnouncement.id 
          ? { ...a, ...formData, updatedAt: new Date().toISOString().split('T')[0] }
          : a
      ));
      toast.success('Announcement updated successfully');
    } else {
      const newAnnouncement: Announcement = {
        id: String(announcements.length + 1),
        ...formData,
        createdBy: 'Prof. Johnson',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setAnnouncements([newAnnouncement, ...announcements]);
      toast.success('Announcement created successfully');
    }
    
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
    toast.success('Announcement deleted successfully');
  };

  const togglePin = (id: string) => {
    setAnnouncements(announcements.map(a =>
      a.id === id ? { ...a, isPinned: !a.isPinned } : a
    ));
    toast.success('Announcement pin status updated');
  };

  const getSectionName = (sectionId: string) => {
    return mockSections.find(s => s.id === sectionId)?.code || 'Unknown';
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background">
        <AppSidebar />
        
        <main className="ml-64 flex-1 p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-heading-1">Announcements</h1>
                <p className="text-body text-muted-foreground mt-1">
                  Post and manage class announcements and updates
                </p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => handleOpenDialog()}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Announcement
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <form onSubmit={handleSubmit}>
                    <DialogHeader>
                      <DialogTitle>{editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}</DialogTitle>
                      <DialogDescription>
                        {editingAnnouncement ? 'Update announcement details' : 'Post a new announcement to your section'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="e.g., Midterm Exam Schedule"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                          id="content"
                          value={formData.content}
                          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                          placeholder="Write your announcement here..."
                          rows={6}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="section">Section</Label>
                          <Select
                            value={formData.sectionId}
                            onValueChange={(value) => setFormData({ ...formData, sectionId: value })}
                            required
                          >
                            <SelectTrigger id="section">
                              <SelectValue placeholder="Select section" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockSections.map((section) => (
                                <SelectItem key={section.id} value={section.id}>
                                  {section.name} ({section.code})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center gap-2 pt-8">
                          <input
                            type="checkbox"
                            id="isPinned"
                            checked={formData.isPinned}
                            onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                            className="h-4 w-4"
                          />
                          <Label htmlFor="isPinned" className="cursor-pointer">
                            Pin this announcement
                          </Label>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editingAnnouncement ? 'Update' : 'Post'} Announcement
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search announcements..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={sectionFilter} onValueChange={setSectionFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sections</SelectItem>
                      {mockSections.map((section) => (
                        <SelectItem key={section.id} value={section.id}>
                          {section.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Announcements Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Announcements ({filteredAnnouncements.length})</CardTitle>
                <CardDescription>Manage your class announcements and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Posted By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAnnouncements.map((announcement) => (
                      <TableRow key={announcement.id}>
                        <TableCell>
                          {announcement.isPinned && (
                            <Pin className="h-4 w-4 text-primary fill-primary" />
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">{announcement.title}</p>
                            <p className="text-small text-muted-foreground line-clamp-2">
                              {announcement.content}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{getSectionName(announcement.sectionId)}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-small">{announcement.createdBy}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-small">{announcement.createdAt}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => togglePin(announcement.id)}
                              title={announcement.isPinned ? 'Unpin' : 'Pin'}
                            >
                              {announcement.isPinned ? (
                                <PinOff className="h-4 w-4" />
                              ) : (
                                <Pin className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenDialog(announcement)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(announcement.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}