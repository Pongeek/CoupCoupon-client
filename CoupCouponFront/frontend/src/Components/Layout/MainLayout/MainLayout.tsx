import { useLocation } from "react-router-dom";
import { MainRoute } from "../../Route/MainRoute/MainRoute";
import { Footer } from "../Footer/Footer";
import { Header } from "../Header/Header";
import { Menu } from "../Menu/Menu";
import "./MainLayout.css";

export function MainLayout(): JSX.Element {
    const location = useLocation();
    const hideHeaderAndMenu = ["/login", "/register"].includes(location.pathname) || /^\/thankYouPage\/[^/]+$/.test(location.pathname);

    return (
        <div className="MainLayout">
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

            <main>
                <MainRoute />
            </main>

            <footer>
                <Footer />
            </footer>
        </div>
    );
}