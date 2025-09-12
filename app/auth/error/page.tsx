const AuthErrorPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-700 via-primary-600 to-primary-700 text-primary-foreground flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md text-center space-y-4">
                <h1 className="text-3xl font-display font-semibold">Auth Error</h1>
                <p className="text-primary-100">Something went wrong with authentication</p>
            </div>
        </div>
    );
}

export default AuthErrorPage;