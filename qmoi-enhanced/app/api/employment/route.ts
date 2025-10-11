import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Employment schemas
const EmployeeSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  role: z.string(),
  paymentMethod: z.enum(['mpesa', 'airtel', 'pesapal', 'bank']),
  paymentInfo: z.object({
    accountNumber: z.string().optional(),
    accountName: z.string().optional(),
    mpesaNumber: z.string().optional(),
    airtelNumber: z.string().optional(),
  }),
  status: z.enum(['active', 'inactive', 'pending']).default('pending'),
  monthlySalary: z.number().positive(),
  paymentSchedule: z.enum(['monthly', 'semi-monthly']),
  startDate: z.string(),
  skills: z.array(z.string()).default([]),
  tasks: z.array(z.string()).default([]),
  earnings: z.number().default(0),
  createdAt: z.number().default(() => Date.now()),
});

const UserSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  role: z.string(),
  paymentMethod: z.enum(['mpesa', 'airtel', 'pesapal', 'bank']).optional(),
  paymentInfo: z.object({
    accountNumber: z.string().optional(),
    accountName: z.string().optional(),
    mpesaNumber: z.string().optional(),
    airtelNumber: z.string().optional(),
  }).optional(),
  status: z.enum(['active', 'inactive', 'pending']).default('pending'),
  earnings: z.number().default(0),
  tasks: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  createdAt: z.number().default(() => Date.now()),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database (replace with actual database)
const employees: any[] = [];
const users: any[] = [];
const employmentLogs: any[] = [];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type'); // 'employees' or 'users'
  const status = searchParams.get('status');
  const role = searchParams.get('role');

  try {
    let data = [];
    
    if (type === 'employees') {
      data = employees.filter(emp => 
        (!status || emp.status === status) &&
        (!role || emp.role === role)
      );
    } else if (type === 'users') {
      data = users.filter(user => 
        (!status || user.status === status) &&
        (!role || user.role === role)
      );
    } else {
      data = { employees, users };
    }

    return NextResponse.json({ 
      success: true, 
      data,
      total: Array.isArray(data) ? data.length : employees.length + users.length
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch employment data' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...data } = body;

    if (type === 'employee') {
      const validatedData = EmployeeSchema.parse(data);
      const employee = {
        ...validatedData,
        id: `emp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Date.now(),
      };
      
      employees.push(employee);
      
      // Log the enrollment
      employmentLogs.push({
        id: Date.now(),
        action: 'employee_enrolled',
        employeeId: employee.id,
        details: `Employee ${employee.name} enrolled as ${employee.role}`,
        timestamp: Date.now(),
      });

      return NextResponse.json({ 
        success: true, 
        data: employee,
        message: 'Employee enrolled successfully' 
      });
    } else if (type === 'user') {
      const validatedData = UserSchema.parse(data);
      const user = {
        ...validatedData,
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Date.now(),
      };
      
      users.push(user);
      
      // Log the enrollment
      employmentLogs.push({
        id: Date.now(),
        action: 'user_enrolled',
        userId: user.id,
        details: `User ${user.name} enrolled as ${user.role}`,
        timestamp: Date.now(),
      });

      return NextResponse.json({ 
        success: true, 
        data: user,
        message: 'User enrolled successfully' 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid type specified' 
      }, { status: 400 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Validation failed', 
        details: error.errors 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create employment record' 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, type, ...updates } = body;

    if (type === 'employee') {
      const index = employees.findIndex(emp => emp.id === id);
      if (index === -1) {
        return NextResponse.json({ 
          success: false, 
          error: 'Employee not found' 
        }, { status: 404 });
      }

      employees[index] = { ...employees[index], ...updates };
      
      // Log the update
      employmentLogs.push({
        id: Date.now(),
        action: 'employee_updated',
        employeeId: id,
        details: `Employee ${employees[index].name} updated`,
        timestamp: Date.now(),
      });

      return NextResponse.json({ 
        success: true, 
        data: employees[index],
        message: 'Employee updated successfully' 
      });
    } else if (type === 'user') {
      const index = users.findIndex(user => user.id === id);
      if (index === -1) {
        return NextResponse.json({ 
          success: false, 
          error: 'User not found' 
        }, { status: 404 });
      }

      users[index] = { ...users[index], ...updates };
      
      // Log the update
      employmentLogs.push({
        id: Date.now(),
        action: 'user_updated',
        userId: id,
        details: `User ${users[index].name} updated`,
        timestamp: Date.now(),
      });

      return NextResponse.json({ 
        success: true, 
        data: users[index],
        message: 'User updated successfully' 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid type specified' 
      }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update employment record' 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');

    if (!id || !type) {
      return NextResponse.json({ 
        success: false, 
        error: 'ID and type are required' 
      }, { status: 400 });
    }

    if (type === 'employee') {
      const index = employees.findIndex(emp => emp.id === id);
      if (index === -1) {
        return NextResponse.json({ 
          success: false, 
          error: 'Employee not found' 
        }, { status: 404 });
      }

      const employee = employees[index];
      employees.splice(index, 1);
      
      // Log the removal
      employmentLogs.push({
        id: Date.now(),
        action: 'employee_removed',
        employeeId: id,
        details: `Employee ${employee.name} removed`,
        timestamp: Date.now(),
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Employee removed successfully' 
      });
    } else if (type === 'user') {
      const index = users.findIndex(user => user.id === id);
      if (index === -1) {
        return NextResponse.json({ 
          success: false, 
          error: 'User not found' 
        }, { status: 404 });
      }

      const user = users[index];
      users.splice(index, 1);
      
      // Log the removal
      employmentLogs.push({
        id: Date.now(),
        action: 'user_removed',
        userId: id,
        details: `User ${user.name} removed`,
        timestamp: Date.now(),
      });

      return NextResponse.json({ 
        success: true, 
        message: 'User removed successfully' 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid type specified' 
      }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to remove employment record' 
    }, { status: 500 });
  }
} 