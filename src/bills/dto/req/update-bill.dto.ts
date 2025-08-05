/* eslint-disable prettier/prettier */
import { IsNotEmpty } from "class-validator";
import { PaymentStatus } from "../../enums/payment-status.enum";

export class UpdateStatusBillDTO {
    @IsNotEmpty({ message: 'The status of bill must have' })
    status: PaymentStatus
}