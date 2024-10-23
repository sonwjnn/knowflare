import { useGetCarts } from '@/features/carts/api/use-get-carts'
import { useCartSheet } from '@/features/carts/store/use-cart-sheet'
import { cn } from '@/lib/utils'
import { ShoppingCart } from 'lucide-react'

export const Cart = () => {
  const { data: carts, isPending: cartsLoading } = useGetCarts()

  const [open, setOpen] = useCartSheet()

  // const handleMouseEnter = () => {
  //   clearTimeout(timeoutRef.current)
  //   setIsOpen(true)
  // }

  // const handleMouseLeave = () => {
  //   timeoutRef.current = setTimeout(() => setIsOpen(false), 200)
  // }

  // useEffect(() => {
  //   return () => clearTimeout(timeoutRef.current)
  // }, [])

  return (
    <div
      className="group relative border-none bg-white p-2 text-primary hover:bg-transparent"
      onClick={() => setOpen(true)}
    >
      <ShoppingCart
        className={cn('size-5', open && 'text-blue-500 transition-colors')}
      />
      {!cartsLoading && (
        <span className="absolute -right-1 top-0 flex size-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
          {(carts ?? []).length || 0}
        </span>
      )}
    </div>
    // <Popover open={isOpen} onOpenChange={setIsOpen}>
    //   <PopoverTrigger asChild>
    //     <div
    //       className="group relative border-none bg-white p-2 text-primary hover:bg-transparent"
    //       onMouseEnter={handleMouseEnter}
    //       onMouseLeave={handleMouseLeave}
    //       onClick={() => router.push('/cart')}
    //     >
    //       <ShoppingCart
    //         className={cn(
    //           'size-5',
    //           isOpen && 'text-blue-500 transition-colors'
    //         )}
    //       />
    //       <span className="absolute -right-1 top-0 flex size-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
    //         {(carts ?? []).length || 0}
    //       </span>
    //     </div>
    //   </PopoverTrigger>
    //   <PopoverContent
    //     className="w-80"
    //     onMouseEnter={handleMouseEnter}
    //     onMouseLeave={handleMouseLeave}
    //   >
    //     <div className="grid gap-4">
    //       <div className="space-y-2">
    //         <h4 className="font-medium leading-none">Your Cart</h4>
    //         <p className="text-sm text-muted-foreground">
    //           Manage your cart items
    //         </p>
    //       </div>
    //       {!!carts?.length && (
    //         <>
    //           <ScrollArea className="h-[300px] rounded-none border p-4">
    //             {carts?.map(item => (
    //               <div
    //                 key={item.courseId}
    //                 className="mb-4 flex items-center space-x-4"
    //               >
    //                 <div className="size-16">
    //                   <Image
    //                     src={item.imageUrl || ''}
    //                     alt={item.title}
    //                     width={0}
    //                     height={0}
    //                     sizes="100vw"
    //                     className="h-full w-auto rounded-none object-cover"
    //                   />
    //                 </div>
    //                 <div className="flex-1">
    //                   <h5 className="font-medium">{item.title}</h5>
    //                   <p className="text-sm text-muted-foreground">
    //                     ${item.price}
    //                   </p>
    //                 </div>
    //               </div>
    //             ))}
    //           </ScrollArea>
    //           <div className="flex items-center justify-between">
    //             <p className="text-sm font-medium">Total:</p>
    //             <p className="text-lg font-bold">${total}</p>
    //           </div>
    //           <Link href="/cart">
    //             <Button className="w-full">Go to Cart</Button>
    //           </Link>
    //         </>
    //       )}
    //       {!carts?.length && (
    //         <>
    //           <div className="flex h-40 items-center justify-center">
    //             <p>Your cart is empty.</p>
    //           </div>
    //           <Link href="/courses">
    //             <Button className="w-full">Explore Courses</Button>
    //           </Link>
    //         </>
    //       )}
    //     </div>
    //   </PopoverContent>
    // </Popover>
  )
}
