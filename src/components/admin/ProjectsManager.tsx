'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit2, Trash2, Eye, Package } from 'lucide-react'
import { createClient, Project } from '@/lib/supabase'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import ImageUpload from './ImageUpload'
import { deleteProjectImage, ImageUploadResult } from '@/lib/imageUpload'

export default function ProjectsManager() {
  const supabase = createClient();
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    prices: {
      complete: '',
      hardware: '',
      mentorship: '',
      mentorship_hardware: '',
      other: '',
    },
    image_url: '',
    image_path: '',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    category: '',
    components: '',
    skills: ''
  })
  const [uploadError, setUploadError] = useState<string | null>(null)

  const fetchProjects = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects((data as unknown as Project[]) || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setIsLoading(false)
    }
  }, [supabase, setProjects, setIsLoading])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if image is provided
    if (!formData.image_url) {
      setUploadError('Please upload an image for the project')
      return
    }

    setIsLoading(true)
    setUploadError(null)

    try {
      const projectData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        prices: {
          complete: parseFloat(formData.prices.complete),
          hardware: parseFloat(formData.prices.hardware),
          mentorship: parseFloat(formData.prices.mentorship),
          mentorship_hardware: parseFloat(formData.prices.mentorship_hardware),
          other: parseFloat(formData.prices.other),
        },
        image_url: formData.image_url,
        image_path: formData.image_path,
        difficulty: formData.difficulty,
        category: formData.category,
        components: formData.components.split(',').map(item => item.trim()),
        skills: formData.skills.split(',').map(item => item.trim())
      }

      if (editingProject) {
        // If editing and there's an old image path, delete it if the image changed
        const oldImagePath = editingProject?.image_path;
        if (oldImagePath && oldImagePath !== formData.image_path && formData.image_path) {
          await deleteProjectImage(oldImagePath)
        }

        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingProject.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([projectData])

        if (error) throw error
      }

      await fetchProjects()
      resetForm()
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error saving project:', error)
      setUploadError('Failed to save project. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = (result: ImageUploadResult) => {
    if (result.success) {
      setFormData({
        ...formData,
        image_url: result.url || '',
        image_path: result.path || ''
      })
      setUploadError(null)
    } else {
      setUploadError(result.error || 'Failed to upload image')
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setFormData({
      name: project.name,
      description: project.description,
      price: project.price.toString(),
      prices: {
        complete: project.prices.complete.toString(),
        hardware: project.prices.hardware.toString(),
        mentorship: project.prices.mentorship.toString(),
        mentorship_hardware: project.prices.mentorship_hardware.toString(),
        other: project.prices.other.toString(),
      },
      image_url: project.image_url,
      image_path: project.image_path || '',
      difficulty: project.difficulty,
      category: project.category,
      components: project.components.join(', '),
      skills: project.skills.join(', ')
    })
    setUploadError(null)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      // Get the project to find the image path
      const project = projects.find(p => p.id === id)
      const imagePath = project?.image_path;

      // Delete the project from database
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Delete the image from storage if it exists
      if (imagePath) {
        await deleteProjectImage(imagePath)
      }

      await fetchProjects()
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      prices: {
        complete: '',
        hardware: '',
        mentorship: '',
        mentorship_hardware: '',
        other: '',
      },
      image_url: '',
      image_path: '',
      difficulty: 'beginner',
      category: '',
      components: '',
      skills: ''
    })
    setEditingProject(null)
    setUploadError(null)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Projects Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </DialogTitle>
              <DialogDescription>
                {editingProject ? 'Update project details' : 'Create a new IoT project for your store'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Base Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                  <Label className="mt-2">Prices by Option (₹)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Complete Project"
                      type="number"
                      step="0.01"
                      value={formData.prices.complete}
                      onChange={e => setFormData({...formData, prices: {...formData.prices, complete: e.target.value}})}
                    />
                    <Input
                      placeholder="Hardware Only"
                      type="number"
                      step="0.01"
                      value={formData.prices.hardware}
                      onChange={e => setFormData({...formData, prices: {...formData.prices, hardware: e.target.value}})}
                    />
                    <Input
                      placeholder="Mentorship"
                      type="number"
                      step="0.01"
                      value={formData.prices.mentorship}
                      onChange={e => setFormData({...formData, prices: {...formData.prices, mentorship: e.target.value}})}
                    />
                    <Input
                      placeholder="Mentorship + Hardware"
                      type="number"
                      step="0.01"
                      value={formData.prices.mentorship_hardware}
                      onChange={e => setFormData({...formData, prices: {...formData.prices, mentorship_hardware: e.target.value}})}
                    />
                    <Input
                      placeholder="Other"
                      type="number"
                      step="0.01"
                      value={formData.prices.other}
                      onChange={e => setFormData({...formData, prices: {...formData.prices, other: e.target.value}})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  required
                />
              </div>

              <ImageUpload
                onImageUploaded={handleImageUpload}
                currentImageUrl={formData.image_url}
                projectId={editingProject?.id}
                disabled={isLoading}
              />

              {uploadError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{uploadError}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select value={formData.difficulty} onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => setFormData({...formData, difficulty: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="components">Components (comma-separated)</Label>
                <Input
                  id="components"
                  value={formData.components}
                  onChange={(e) => setFormData({...formData, components: e.target.value})}
                  placeholder="Arduino Uno, LED, Resistor, etc."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma-separated)</Label>
                <Input
                  id="skills"
                  value={formData.skills}
                  onChange={(e) => setFormData({...formData, skills: e.target.value})}
                  placeholder="Programming, Electronics, Soldering, etc."
                  required
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : (editingProject ? 'Update' : 'Create')} Project
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="text-gray-500">Loading projects...</div>
        </div>
      ) : (
        <div className="grid gap-6">
          {projects.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No projects yet</h3>
                <p className="text-gray-500 mb-4">Get started by creating your first IoT project.</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </Button>
              </CardContent>
            </Card>
          ) : (
            projects.map((project) => (
              <Card key={project.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{project.name}</h3>
                        <Badge className={getDifficultyColor(project.difficulty)}>
                          {project.difficulty}
                        </Badge>
                        <Badge variant="outline">{project.category}</Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{project.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span className="font-medium text-green-600">₹{project.price}</span>
                        <span>{project.components.length} components</span>
                        <span>{project.skills.length} skills</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {project.skills.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {project.skills.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{project.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => window.open(`/projects/${project.id}`, '_blank')}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(project)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(project.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
