import BackBtn from "@/helpers/BackButton";

export default function NotFound() {
    return (<section>
        <div className="px-6 py-12 mx-auto">
            <div>
                <p className="text-sm font-medium text-white">Search not found</p>
                <h1 className="mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">We can’t find that page</h1>

                <div className="flex items-center mt-6 gap-x-3">
                    <div className='hover:bg-gray-800 hover:text-accent-foreground rounded ring-offset-background transition-colors'>
                        <BackBtn />
                    </div>
                    <button className="w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600">
                        Go home
                    </button>
                </div>
            </div>
        </div>
    </section>)
}