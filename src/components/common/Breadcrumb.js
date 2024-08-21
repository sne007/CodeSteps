import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    return (
        <nav className="text-sm mb-8">
            <ol className="list-none p-0 inline-flex">
                <li className="flex items-center">
                    <Link to="/" className="text-indigo-600 hover:text-indigo-800">Home</Link>
                </li>
                {pathnames.map((name, index) => {
                    const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const isLast = index === pathnames.length - 1;
                    return (
                        <li key={name} className="flex items-center">
                            <span className="mx-2 text-gray-500">/</span>
                            {isLast ? (
                                <span className="text-gray-700">{name}</span>
                            ) : (
                                <Link to={routeTo} className="text-indigo-600 hover:text-indigo-800">
                                    {name}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumb;