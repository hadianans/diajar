import React from 'react';

export default function LoginFooter() {
    return (
        <footer className="mt-lg text-center space-y-md w-full">
            <p className="font-label-md text-label-md text-on-surface-variant">
                Don't have an account?{' '}
                <a className="text-primary font-bold hover:underline" href="#">
                    Contact your administrator
                </a>
            </p>
            <div className="flex items-center justify-center space-x-md text-label-sm text-outline">
                <a className="hover:text-on-surface transition-colors" href="#">
                    Privacy Policy
                </a>
                <span className="w-1 h-1 bg-outline rounded-full"></span>
                <a className="hover:text-on-surface transition-colors" href="#">
                    Terms of Service
                </a>
            </div>
        </footer>
    );
}
