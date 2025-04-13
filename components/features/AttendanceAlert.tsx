
import { X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useAttendance } from '@/contexts/AttendanceContext';
import { useNavigate } from 'react-router-dom';

export const AttendanceAlert = () => {
  const { alerts, dismissAlert } = useAttendance();
  const navigate = useNavigate();
  
  if (alerts.length === 0) return null;
  
  return (
    <div className="space-y-2">
      {alerts.map((alert) => (
        <Alert key={alert.subject} className={alert.severity === 'critical' ? 'border-destructive' : 'border-warning'}>
          <div className="flex items-start justify-between">
            <div>
              <AlertTitle className={alert.severity === 'critical' ? 'text-destructive' : 'text-warning'}>
                Attendance Alert: {alert.subject}
              </AlertTitle>
              <AlertDescription>
                Your {alert.subject} attendance ({alert.percentage}%) is {alert.percentage < alert.threshold ? 'below' : 'just at'} the minimum required threshold of {alert.threshold}%. 
                Please make sure to attend upcoming classes.
              </AlertDescription>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2" 
                onClick={() => navigate('/dashboard/attendance')}
              >
                View Attendance
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 rounded-full"
              onClick={() => dismissAlert(alert.subject)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Dismiss</span>
            </Button>
          </div>
        </Alert>
      ))}
    </div>
  );
};

export default AttendanceAlert;
