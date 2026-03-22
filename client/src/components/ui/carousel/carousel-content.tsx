import useCarousel from './useCarousel';
import * as React from 'react';
import { cn } from '../utils';

function CarouselContent({ className, ...props }: React.ComponentProps<'div'>) {
    const { carouselRef, orientation } = useCarousel();
    return (
        <div ref={carouselRef} className="overflow-hidden" data-slot="carousel-content">
            <div
                className={cn(
                    'flex',
                    orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col',
                    className
                )}
                {...props}
            />
        </div>
    );
}

export default CarouselContent;
