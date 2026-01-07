import { useAuth } from '../context/AuthContext';
import { StudentDashboard } from '../components/dashboards/StudentDashboard';
import { TeacherDashboard } from '../components/dashboards/TeacherDashboard';
import { AdminDashboard } from '../components/dashboards/AdminDashboard';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { Loader } from '../components/ui/Loader';

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen text="Loading dashboard..." />;
  }

  if (!user) {
    return null;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'STUDENT':
        return <StudentDashboard />;
      case 'TEACHER':
        return <TeacherDashboard />;
      case 'ADMIN':
        return <AdminDashboard />;
      default:
        return <StudentDashboard />;
    }
  };

  return <DashboardLayout>{renderDashboard()}</DashboardLayout>;
}
