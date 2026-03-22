import { ArrowLeft } from 'lucide-react';
import { useCarousel } from './index'; // src/components/carousel
import { Button } from '../index'; // src/components
import * as React from 'react';
import { cn } from '../utils';

function CarouselPrevious({
    className,
    variant = 'outline',
    size = 'icon',
    ...props
}: React.ComponentProps<typeof Button>) {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel();
    return (
        <Button
            data-slot="carousel-previous"
            variant={variant}
            size={size}
            className={cn(
                'absolute size-8 rounded-full',
                orientation === 'horizontal'
                    ? 'top-1/2 -left-12 -translate-y-1/2'
                    : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
                className
            )}
            disabled={!canScrollPrev}
            onClick={scrollPrev}
            {...props}
        >
            <ArrowLeft />
            <span className="sr-only">Previous slide</span>
        </Button>
    );
}

export default CarouselPrevious;
