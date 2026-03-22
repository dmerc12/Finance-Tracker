import { ArrowRight } from 'lucide-react';
import { useCarousel } from './index'; // src/components/carousel
import { Button } from '../index'; // src/components
import * as React from 'react';
import { cn } from '../utils';

function CarouselNext({
    className,
    variant = 'outline',
    size = 'icon',
    ...props
}: React.ComponentProps<typeof Button>) {
    const { orientation, scrollNext, canScrollNext } = useCarousel();
    return (
        <Button
            data-slot="carousel-next"
            variant={variant}
            size={size}
            className={cn(
                'absolute size-8 rounded-full',
                orientation === 'horizontal'
                    ? 'top-1/2 -right-12 -translate-y-1/2'
                    : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
                className
            )}
            disabled={!canScrollNext}
            onClick={scrollNext}
            {...props}
        >
            <ArrowRight />
            <span className="sr-only">Next slide</span>
        </Button>
    );
}

export default CarouselNext;
