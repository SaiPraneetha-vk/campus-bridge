
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for attendance
const monthlyData = [
  { month: 'Jan', present: 20, absent: 3, leave: 2 },
  { month: 'Feb', present: 18, absent: 5, leave: 1 },
  { month: 'Mar', present: 22, absent: 2, leave: 1 },
  { month: 'Apr', present: 21, absent: 4, leave: 0 },
  { month: 'May', present: 19, absent: 6, leave: 0 },
  { month: 'Jun', present: 17, absent: 8, leave: 0 },
];

const subjectData = [
  { name: 'Web Technologies', attendance: 75 },
  { name: 'Computer Networks', attendance: 68 },
  { name: 'Data Structures', attendance: 78 },
  { name: 'Operating Systems', attendance: 88 },
  { name: 'Artificial Intelligence', attendance: 85 },
];

const COLORS = ['#4f46e5', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'];

const AttendanceCharts = () => {
  const totalClasses = monthlyData.reduce(
    (acc, month) => acc + month.present + month.absent + month.leave,
    0
  );
  
  const totalPresent = monthlyData.reduce((acc, month) => acc + month.present, 0);
  const overallAttendance = (totalPresent / totalClasses) * 100;
  
  const pieData = [
    { name: 'Present', value: totalPresent },
    { name: 'Absent', value: monthlyData.reduce((acc, month) => acc + month.absent, 0) },
    { name: 'Leave', value: monthlyData.reduce((acc, month) => acc + month.leave, 0) },
  ];

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
        <TabsTrigger value="subjects">Subject-wise</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Overall Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value} days`, '']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-center">
                <h4 className="text-lg font-semibold">
                  {overallAttendance.toFixed(1)}% Attendance
                </h4>
                <p className="text-sm text-muted-foreground">
                  {overallAttendance >= 75 
                    ? "You're doing great! Keep it up." 
                    : "Your attendance is below the required 75%. Please improve."}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Subject Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Attendance']}
                    />
                    <Bar 
                      dataKey="attendance" 
                      fill="#4f46e5"
                      radius={[0, 4, 4, 0]}
                      label={{
                        position: 'right',
                        formatter: (value: number) => `${value}%`,
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="monthly">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" stackId="a" fill="#4f46e5" name="Present" />
                  <Bar dataKey="absent" stackId="a" fill="#ef4444" name="Absent" />
                  <Bar dataKey="leave" stackId="a" fill="#f59e0b" name="Leave" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="subjects">
        <Card>
          <CardHeader>
            <CardTitle>Subject-wise Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Attendance']} />
                  <Bar
                    dataKey="attendance"
                    fill="#4f46e5"
                    radius={[4, 4, 0, 0]}
                    label={{
                      position: 'top',
                      formatter: (value: number) => `${value}%`,
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4">
              <h4 className="font-semibold">Attendance Alert</h4>
              <p className="text-sm text-destructive">
                Your attendance in Web Technologies (75%) is just at the minimum required threshold. 
                Make sure to attend upcoming classes to maintain eligibility for exams.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AttendanceCharts;
