import "./Main.css";

export function Main(): JSX.Element {
    return (
        <div className="Main">
            <h1>Welcome to CoupCoupon Site</h1>
            <p>
                Our site offers a comprehensive platform for managing coupons and deals.
                Depending on your role, you have access to different functionalities:
            </p>
            <h2>Admin</h2>
            <p>As an admin, you can manage the entire platform. Your actions include:</p>
            <ul>
                <li>Managing customers and companies</li>
                <li>Overseeing all coupons and deals</li>
                <li>Ensuring the smooth operation of the platform</li>
            </ul>
            <h2>Company</h2>
            <p>As a company, you can manage your own coupons and deals. Your actions include:</p>
            <ul>
                <li>Creating new coupons</li>
                <li>Updating existing coupons</li>
                <li>Deleting coupons that are no longer valid</li>
                <li>Viewing all your company's coupons</li>
            </ul>
            <h2>Customer</h2>
            <p>As a customer, you can browse and purchase coupons. Your actions include:</p>
            <ul>
                <li>Viewing available coupons</li>
                <li>Purchasing coupons</li>
                <li>Viewing your purchased coupons</li>
                <li>Filtering coupons by category and price</li>
            </ul>
            <p>
                <br /> Pressing on the logo will take you to the home page. <br />
                Explore our platform and make the most of the features available to you. Thank you for visiting!
            </p>
        </div>
    );
}