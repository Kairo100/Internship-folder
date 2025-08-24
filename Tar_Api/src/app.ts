import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './auth/auth.routes';
import trainerRouter from './trainer/trainer.routes'
import userRoutes from './user/user.routes'
import groupRouter from './group/group.routes';
import memberRouter from './member/member.routes'
import cycleRouter from './cycle/cycle.routes'
import meetingRouter from './meeting/meeting.routes'
import { router as savingRouter } from './saving/saving.routes';
import { router as loanRouter } from './loan/loan.routes'; 
import { router as repaymentRouter } from './repayment/repayment.routes'; 
import { router as attendanceRouter } from './attendance/attendance.routes';
import { router as notificationRouter } from './notification/notification.routes'; 
import globalErrorHandler from './middlewares/globalErrorHandler'; 
import { notFound } from './middlewares/notFound'; 



dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes ); 
app.use('/api/trainers', trainerRouter); 
app.use('/api/groups', groupRouter);
app.use('/api/members', memberRouter); 
app.use('/api/cycles', cycleRouter);
app.use('/api/meetings', meetingRouter);
app.use('/api/savings', savingRouter); 
app.use('/api/loans', loanRouter);
app.use('/api/repayments', repaymentRouter); 
app.use('/api/attendance', attendanceRouter); 
app.use('/api/notifications', notificationRouter); 
// // Handle 404 Not Found errors - MUST be after all app.use('/api/v1', routes)
// app.all('*', notFound);
// // Global error handling middleware - MUST be the last middleware
// app.use(globalErrorHandler);


export default app;
