export const API_BASE_URL = process.env.GYM_API_BASE_URL;
export const Endpoints = {
    Auth: {
        Register: `/register`,
        Login: '/login',
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
        Base: `/api/dashboard`,
    },
    Exercise: {
        Base: `/api/exercise`,
        ById: (id: string) => `/api/exercise/${id}`,
    },
    ExerciseWorkout: {
        Base: `/api/exerciseWorkout`,
        GetLatest: (exerciseId: string, workoutId: string | null) => workoutId ? `/api/exerciseWorkout/GetLatest/${exerciseId}/${workoutId}` : `/api/exerciseWorkout/GetLatest/${exerciseId}`,
    },
    MuscleGroup: {
        Base: `/api/muscleGroup`,
        ById: (id: string) => `/api/muscleGroup/${id}`,
    },
    Workout: {
        Base: `/api/workouts`,
        ById: (id: string) => `/api/workouts/${id}`,
        GetForEdit: (id: string) => `/api/workouts/GetForEdit/${id}`,
    },
} as const; 