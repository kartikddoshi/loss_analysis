-- CreateIndex
CREATE INDEX "loss_data_item_no_date_idx" ON "loss_data"("item_no", "date");

-- CreateIndex
CREATE INDEX "weight_data_item_no_date_idx" ON "weight_data"("item_no", "date");
