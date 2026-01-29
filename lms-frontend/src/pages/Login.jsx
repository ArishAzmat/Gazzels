import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Loader2 } from 'lucide-react';
import { useState } from 'react';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const onSubmit = async (data) => {
        setIsLoading(true);
        setError('');
        try {
            const user = await login(data.email, data.password);
            if (user.role === 'Admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError('The credentials you entered are incorrect. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px] animate-pulse delay-700" />

            <div className="max-w-md w-full px-6 py-12 relative z-10">
                <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[2rem] shadow-2xl border border-white/20">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-2xl shadow-xl shadow-primary/20 mb-6 rotate-3 hover:rotate-0 transition-transform duration-300">
                            <Lock className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-4xl font-black text-primary tracking-tight mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-secondary font-bold uppercase tracking-[0.2em] text-[10px]">
                            Gazelles Management System
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-secondary uppercase tracking-wider ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        {...register('email', { required: true })}
                                        type="email"
                                        className="block w-full px-4 py-3.5 pl-12 bg-gray-50/50 border border-gray-100 rounded-2xl text-primary font-medium focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary transition-all text-sm"
                                        placeholder="name@company.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-secondary uppercase tracking-wider ml-1">Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        {...register('password', { required: true })}
                                        type="password"
                                        className="block w-full px-4 py-3.5 pl-12 bg-gray-50/50 border border-gray-100 rounded-2xl text-primary font-medium focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary transition-all text-sm"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold p-4 rounded-xl text-center animate-shake">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center py-4 px-6 bg-primary text-white text-sm font-black rounded-2xl hover:bg-primary-light focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:opacity-50 transition-all shadow-xl shadow-primary/20 active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin h-5 w-5" />
                            ) : (
                                <span className="uppercase tracking-widest">Sign In</span>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-xs text-gray-400 font-medium tracking-tight">
                            Secure Enterprise Access Control
                        </p>
                    </div>
                </div>

                <p className="mt-8 text-center text-xs text-secondary font-bold uppercase tracking-widest opacity-50">
                    &copy; 2026 Gazelles LMS &bull; All Rights Reserved
                </p>
            </div>
        </div>
    );
};

export default Login;
