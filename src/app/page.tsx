"use client";

import messages from "@/messages.json";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useRef } from "react";

const Home = () => {
  const plugin = useRef(
    Autoplay({
      delay: 2000,
      stopOnInteraction: false,
    }),
  );

  return (
    <>
      <main className="min-h-screen">
        <section className="container mx-auto flex flex-col items-center justify-center px-4 py-20 text-center">
          <h1 className="text-4xl font-bold md:text-6xl">
            Dive Into The World Of Anonymous Conversations
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Explore Mystery Message — where your identity remains a secret and
            honest conversations begin.
          </p>
        </section>
        <Carousel
          plugins={[plugin.current]}
          className="mx-auto w-full max-w-xl"
          onMouseEnter={() => plugin.current.stop()}
          onMouseLeave={() => {
            plugin.current.reset();
            plugin.current.play();
          }}
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="md:basis-full">
                <div className="p-1">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold">{message.title}</h3>

                      <p className="mt-2 text-muted-foreground">
                        {message.content}
                      </p>

                      <p className="mt-4 text-sm text-gray-500">
                        {message.received}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </main>
    </>
  );
};
export default Home;
