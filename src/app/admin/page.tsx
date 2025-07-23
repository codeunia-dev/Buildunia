import AdminDashboard from '@/components/admin/AdminDashboard'

export default async function AdminPage() {
  // For now, we'll create a simple admin check
  // In production, you should implement proper admin role checking
  
  return (
    <div className="min-h-screen bg-black">
      <AdminDashboard />
    </div>
  )
}
