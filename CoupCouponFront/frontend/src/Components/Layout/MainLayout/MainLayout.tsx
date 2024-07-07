import { useLocation } from "react-router-dom";
import { MainRoute } from "../../Route/MainRoute/MainRoute";
import { Footer } from "../Footer/Footer";
import { Header } from "../Header/Header";
import { Menu } from "../Menu/Menu";
import "./MainLayout.css";

/**
 * MainLayout component that serves as the main layout for the application.
 * It conditionally renders the Header and Menu components based on the current route.
 * @returns {JSX.Element} The rendered MainLayout component.
 */
export function MainLayout(): JSX.Element {
    const location = useLocation();

    // Determine if the Header and Menu should be hidden based on the current route
    const hideHeaderAndMenu = ["/login", "/register"].includes(location.pathname) || /^\/thankYouPage\/[^/]+$/.test(location.pathname);

    return (
        <div className="MainLayout">
            {/* Conditionally render the Header and Menu components */}
            {!hideHeaderAndMenu && (
                <>
                    <header>
                        <Header />
                    </header>
                    <aside>
                        <Menu />
                    </aside>
                </>
            )}

            {/* Main content area */}
            <main>
                <MainRoute />
            </main>

            {/* Footer component */}
            <footer>
                <Footer />
            </footer>
        </div>
    );
}