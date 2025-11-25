import { Heart, Star } from 'lucide-react';
import serviceAvatar from '@/assets/images/serviceAvatar.png';
import avatarImage from '@/assets/images/avatar.png';
import KeyBoardArrow from '@/assets/svgs/keyboard_arrow.svg?react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';

export default function ServiceCard() {
    return (
        <div className=" shadow-[0_0_20px_0_rgba(0,0,0,0.1)] hover:shadow-[0_1px_10px_0_rgba(0,0,0,0.25)] dark:shadow-[0_0px_15px_0_var(--primary)]/30 rounded-2xl p-5">
            <div className="flex justify-between gap-4 items-start">
                <Avatar className="size-32">
                    <AvatarImage src={serviceAvatar} alt="" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-primary py-1.5 px-3">
                        New
                    </Badge>
                    <Button variant={'secondary'} className="rounded-full">
                        <Heart className="text-muted-foreground" />
                    </Button>
                </div>
            </div>
            <h1 className="text-2xl font-medium my-3">Virtual Business Coaching</h1>
            <div className="flex items-center gap-2 justify-between">
                <Link to={'/provider/id'}>
                    <div className="flex items-center gap-2">
                        <Avatar>
                            <AvatarImage src={avatarImage} alt="" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <h3 className="text-xl ">Michelle</h3>
                    </div>
                </Link>
                <span className="text-muted-foreground text-sm flex items-center gap-1">
                    <Star className="text-yellow-500 size-4" /> 4.9 (120)
                </span>
            </div>
            <span className="text-success text-sm">Instant Booking available</span>
            <hr className="my-4 border-1 border-muted " />
            <div className="flex justify-between items-center">
                <div>
                    <div className="flex items-end gap-2 ">
                        <p className="text-primary text-4xl font-medium">75</p>
                        <span className="font-extralight">(10% Off)</span>
                    </div>
                    <span>Per session</span>
                </div>
                <Link to={'/book_appointment/:id'}>
                    <Button className="rounded-full text-lg !px-7 !py-5">
                        Book Now <KeyBoardArrow className="size-8 rotate-270" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}
