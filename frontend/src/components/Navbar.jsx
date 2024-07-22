import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Navbar() {
	return (
		<nav>
			<NavigationMenu>
				<NavigationMenuList>
					{/* Brand */}
					<NavigationMenuItem>My Online Shop</NavigationMenuItem>
					{/* Search Input */}
					<NavigationMenuItem>
						<Input placeholder="Search Products....." />
					</NavigationMenuItem>
					{/* Search button */}
					<NavigationMenuItem>
						<Button>Search</Button>
					</NavigationMenuItem>
					{/* Cart */}
					<NavigationMenuItem>Cart</NavigationMenuItem>
					{/* Account */}
					<NavigationMenuItem>Account</NavigationMenuItem>
					{/* Theme toggle */}
					<NavigationMenuItem>
						<ModeToggle />
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
		</nav>
	);
}
