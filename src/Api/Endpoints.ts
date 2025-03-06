export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const apiPrefix = 'api';
export const Endpoints = {
    Auth: {
        Register: `/register`,
        Login: '/login?useCookies=true',
        Logout: '/logout',
        Refresh: '/refresh',
        Info: '/manage/info',
        ConfirmEmail: '/confirmEmail',
        ResendConfirmation: '/resendConfirmationEmail',
        ForgotPassword: '/forgotPassword',
        ResetPassword: '/resetPassword',
        TwoFactor: '/manage/2fa'
    },
    Dashboard: {
        Base: `${apiPrefix}/dashboard`,
    },
    Exercise: {
        Base: `${apiPrefix}/exercise`,
        ById: (id: string) => `${apiPrefix}/exercise/${id}`,
    },
    ExerciseWorkout: {
        Base: `${apiPrefix}/exerciseWorkout`,
        GetLatest: (exerciseId: string, workoutId: string) => `${apiPrefix}/exerciseWorkout/GetLatest/${exerciseId}/${workoutId}`,
    },
    MuscleGroup: {
        Base: `${apiPrefix}/muscleGroup`,
        ById: (id: string) => `${apiPrefix}/muscleGroup/${id}`,
    },
    Workout: {
        Base: `${apiPrefix}/workout`,
        ById: (id: string) => `${apiPrefix}/workout/${id}`,
        GetForEdit: (id: string) => `${apiPrefix}/workout/GetForEdit/${id}`,
    },
} as const; 