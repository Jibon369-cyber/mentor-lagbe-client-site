import Link from "next/link";


const Navbar = () => {
    return (
        <div className="max-w-7xl  flex justify-end gap-3">
            <Link href='/sign-up'>Sign Up</Link>
            <Link href='/sign-in'>Sign In</Link>
        </div>
    );
};

export default Navbar;