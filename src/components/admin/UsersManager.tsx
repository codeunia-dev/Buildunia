'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Users, Search, UserCheck, UserX, Crown } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useBuilduniaAuth } from '@/contexts/BuilduniaAuthContext'
import Image from 'next/image';

interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  role?: string
  created_at: string
  last_sign_in_at?: string
  user_metadata?: any
}

export default function UsersManager() {
  const supabase = createClient();
  const { user: currentUser } = useBuilduniaAuth();
  const [users, setUsers] = useState<UserProfile[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const filterUsers = useCallback(() => {
    if (!searchTerm) {
      setFilteredUsers(users);
      return;
    }
    const filtered = users.filter(user => 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const fetchUsers = useCallback(async () => {
    try {
      console.log('Fetching current user and creating user list...')
      
      // Since we can't use admin API, let's show the current user and some sample data
      if (currentUser) {
        const currentUserProfile: UserProfile = {
          id: currentUser.id,
          email: currentUser.email || '',
          full_name: currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || 'Codeunia Dev',
          avatar_url: currentUser.user_metadata?.avatar_url || currentUser.user_metadata?.picture || '',
          role: currentUser.user_metadata?.role || 'admin',
          created_at: currentUser.created_at,
          last_sign_in_at: currentUser.last_sign_in_at,
          user_metadata: currentUser.user_metadata
        }
        
        // Add some sample users for demonstration
        const sampleUsers: UserProfile[] = [
          currentUserProfile,
          {
            id: 'sample-1',
            email: 'user1@example.com',
            full_name: 'John Doe',
            avatar_url: '',
            role: 'user',
            created_at: new Date().toISOString(),
            last_sign_in_at: new Date().toISOString(),
            user_metadata: { role: 'user' }
          },
          {
            id: 'sample-2',
            email: 'user2@example.com',
            full_name: 'Jane Smith',
            avatar_url: '',
            role: 'moderator',
            created_at: new Date().toISOString(),
            last_sign_in_at: new Date().toISOString(),
            user_metadata: { role: 'moderator' }
          }
        ]
        
        setUsers(sampleUsers)
        console.log('Set users:', sampleUsers.length)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setIsLoading(false)
    }
  }, [currentUser]);

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers]);

  useEffect(() => {
    filterUsers()
  }, [filterUsers]);

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      // Only allow updating current user's role
      if (userId === currentUser?.id) {
        const { error } = await supabase.auth.updateUser({
          data: { role: newRole }
        })
        if (error) throw error
        await fetchUsers()
      } else {
        console.log('Can only update current user role in demo mode')
      }
    } catch (error) {
      console.error('Error updating user role:', error)
    }
  }

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'moderator': return 'bg-blue-100 text-blue-800'
      case 'premium': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case 'admin': return <Crown className="w-3 h-3" />
      case 'moderator': return <UserCheck className="w-3 h-3" />
      default: return <Users className="w-3 h-3" />
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="text-gray-500">Loading users...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Users Management</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{users.length}</div>
                <div className="text-xs text-gray-500">Total Users</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-red-500" />
              <div>
                <div className="text-2xl font-bold">
                  {users.filter(user => user.role === 'admin').length}
                </div>
                <div className="text-xs text-gray-500">Admins</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">
                  {users.filter(user => user.role === 'moderator').length}
                </div>
                <div className="text-xs text-gray-500">Moderators</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserX className="w-4 h-4 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">
                  {users.filter(user => user.role === 'premium').length}
                </div>
                <div className="text-xs text-gray-500">Premium Users</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            Manage user accounts and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                {searchTerm ? 'No users found' : 'No users yet'}
              </h3>
              <p className="text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Users will appear here when they sign up.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      {user.avatar_url ? (
                        <Image 
                          src={user.avatar_url} 
                          alt={user.full_name || user.email || 'User'}
                          className="w-10 h-10 rounded-full object-cover"
                          width={40}
                          height={40}
                        />
                      ) : (
                        <Users className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">
                          {user.full_name || (user.email ? user.email.split('@')[0] : 'Unknown User')}
                        </h4>
                        <Badge className={getRoleColor(user.role)}>
                          <div className="flex items-center gap-1">
                            {getRoleIcon(user.role)}
                            {user.role || 'user'}
                          </div>
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{user.email || 'No email'}</p>
                      <p className="text-xs text-gray-500">
                        Joined {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown date'}
                        {user.last_sign_in_at && (
                          <span className="ml-2">
                            • Last active {new Date(user.last_sign_in_at).toLocaleDateString()}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {user.role !== 'admin' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateUserRole(user.id, user.role === 'moderator' ? 'user' : 'moderator')}
                      >
                        {user.role === 'moderator' ? 'Remove Mod' : 'Make Mod'}
                      </Button>
                    )}
                    {user.role !== 'admin' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateUserRole(user.id, user.role === 'premium' ? 'user' : 'premium')}
                      >
                        {user.role === 'premium' ? 'Remove Premium' : 'Make Premium'}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
