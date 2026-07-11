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
        TwoFactor: '/manage/2fa',
    },
    Dashboard: {
        Base: `/api/dashboard`,
    },
    Exercise: {
        Base: `/api/exercise`,
        GetAll: `/api/exercise/getAll`,
        ById: (id: string) => `/api/exercise/${id}`,
        Analytics: (id: string) => `/api/exercise/${id}/analytics`,
    },
    ExerciseWorkout: {
        Base: `/api/exerciseWorkout`,
        GetLatest: (exerciseId: string, workoutId: string | null) =>
            workoutId
                ? `/api/exerciseWorkout/GetLatest/${exerciseId}?workoutId=${workoutId}`
                : `/api/exerciseWorkout/GetLatest/${exerciseId}`,
        GetPaginated: (exerciseId: string) =>
            `/api/exerciseWorkout/getPaginated/${exerciseId}`,
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
    WorkoutTemplate: {
        Base: `/api/workout-templates`,
        ById: (id: string) => `/api/workout-templates/${id}`,
    },
} as const;
