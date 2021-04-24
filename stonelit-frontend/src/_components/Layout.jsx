import React, {useEffect} from 'react';
import {Header, Footer} from '@/_components';

function Layout({children}) {
    // const {pathname} = useLocation();
    // const [user, setUser] = useState({});

    useEffect(() => {
        // const subscription = accountService.user.subscribe(x => setUser(x));
        // return subscription.unsubscribe; // ralf
    }, []);

    return (
        <>
            <Header />

                <div className="main-container">
                    {children}
                </div>

            <Footer />
        </>
    );
}

export {Layout};
