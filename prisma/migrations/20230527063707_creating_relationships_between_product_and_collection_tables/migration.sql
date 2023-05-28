-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
