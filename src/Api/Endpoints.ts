export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
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
        Base: `/dashboard`,
    },
    Exercise: {
        Base: `/exercise`,
        ById: (id: string) => `/exercise/${id}`,
    },
    ExerciseWorkout: {
        Base: `/exerciseWorkout`,
        GetLatest: (exerciseId: string, workoutId: string | null) => workoutId ? `/exerciseWorkout/GetLatest/${exerciseId}/${workoutId}` : `/exerciseWorkout/GetLatest/${exerciseId}`,
    },
    MuscleGroup: {
        Base: `/muscleGroup`,
        ById: (id: string) => `/muscleGroup/${id}`,
    },
    Workout: {
        Base: `/workout`,
        ById: (id: string) => `/workout/${id}`,
        GetForEdit: (id: string) => `/workout/GetForEdit/${id}`,
    },
} as const; 