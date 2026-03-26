import AIImageBox from '@/components/Dashboard/AI-Image-box/AIImageBox';
import AIImageType from '@/components/Dashboard/AI-Image-TypeBox/AIImageType';
import { useState } from 'react';
import { useParams } from 'react-router';
import { useGetBookDetailsQuery } from '@/redux/endpoints/bookApi';

export default function CreatorResponsive() {
  const { id } = useParams();
  const [selectedStyleId, setSelectedStyleId] = useState(2);
  const [selectedSizeId, setSelectedSizeId] = useState(6);
  const { data: bookDetails } = useGetBookDetailsQuery(id || "", { skip: !id });

  return (
    <div className="w-full max-w-[1600px] mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">AI Creator Studio</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-1">Design your imagination.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        <div className="col-span-1 lg:col-span-8 xl:col-span-9 order-2 lg:order-1">
          <AIImageBox 
            bookId={id ? parseInt(id) : null}
            selectedStyleId={selectedStyleId}
            selectedSizeId={selectedSizeId}
            existingImages={bookDetails?.data?.images}
          />
        </div>

        <div className="col-span-1 lg:col-span-4 xl:col-span-3 order-1 lg:order-2">
          <AIImageType 
            onStyleSelect={setSelectedStyleId}
            selectedStyleId={selectedStyleId}
          />
        </div>
      </div>
    </div>
  );
}
