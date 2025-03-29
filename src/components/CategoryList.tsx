import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'

const CategoryList = async () => {
  const payload = await getPayload({ config: config })
  const categories = await payload.find({
    collection: 'categories',
    limit: 10,
  })

  return (
    <div className="px-4 overflow-x-scroll scrollbar-hide">
      <div className="flex gap-4 md:gap-8">
        {categories.docs.map((category) => (
          <Link
            key={category.id}
            href={`/list?cat=${category.slug}`}
            className="flex-shrink-0 w-full sm-w-1/2 lg:w-1/4 xl:w-1/6"
          >
            <div className="relative bg-slate-100 w-full h-96">
              <Image
                src={category.image?.url || '/category.png'}
                alt={category.name}
                fill
                sizes="209vw"
                className="object-cover"
                placeholder="blur"
                blurDataURL={category.image?.url || '/category.png'}
              />
            </div>
            <h1 className="mt-8 font-light text-xl tracking-wider">{category.name}</h1>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default CategoryList
