import React from 'react';
import ScrollToTop from './layouts/components/ScrollToTop/ScrollToTop';
import MasterLayout from './layouts/Masterlayout/MasterLayout';

function App() {
    return (
        <ScrollToTop>
            <MasterLayout>
                <div className="App">
                    <span>123</span>
                </div>
            </MasterLayout>
        </ScrollToTop>
    );
}

export default App;
