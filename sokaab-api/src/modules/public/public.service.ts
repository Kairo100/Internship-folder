import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
// import { customAlphabet } from 'nanoid';
import * as moment from 'moment-timezone';
import { v4 as uuidv4 } from 'uuid';
import { Decimal } from '@prisma/client/runtime/library';
import { catchError, lastValueFrom, map } from 'rxjs';
import { createHash } from 'crypto';
import { has, omit } from 'lodash';
import { format } from 'date-fns';

import { PrismaService } from 'src/services/prisma.service';
import { PaymentDto, PaystackDto } from './dto';
import { PaystackRequest, WaafiRequest } from 'src/types/payment.type';

//added
import * as nodemailer from 'nodemailer';
import { title } from 'process';


@Injectable()
export class PublicService {
  private readonly WAAFIMERCHANTUID = 'M0913684';
  private readonly WAAFIAPIUSERID = '1007533';
  private readonly WAAFIAPIKEY = 'API-2112171381AHX';
  // private readonly API_KEY = 'zmWMHxhFkA56n31EbAQj6n31EbAQj81080';
  // private readonly API_SECRET = 'e9d935ce63a59404acb8e10aaab44faf454';
  private readonly API_KEY = 'sGKjOmAoQznQb34xLvzW4ZbacKBOyNcvDmXn8EYzR';
  private readonly API_SECRET = 'bfPjulrc7V649W1F8ELB6MXHG5z7kt76juiKW0';
  private readonly TARMIYE_API_KEY =
    'IWN8d8qo0XiSQO1KN5cgzaCZ1unPf6kfmG9d0bwGN';
  private readonly TARMIYE_API_SECRET =
    'rQrISGI8PV3hJdvgHzCxIyjP1jnXzQS1zkY70W';
  private readonly logger = new Logger(PublicService.name);
  // private readonly formattedDate = format(new Date(), 'M/dd/yyyy h:mm:ss a');
  private now = new Date();
  private readonly stringFormattedDate = `${(this.now.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${this.now
    .getDate()
    .toString()
    .padStart(2, '0')}/${this.now.getFullYear()}`;

  constructor(
    private prisma: PrismaService,
    private http: HttpService,
  ) {}

  //** Waafi Payment Gateway */
  preparingWaafiParams(waafiData: PaymentDto): WaafiRequest {
    // const nanoid = customAlphabet('1234567890abcdef', 10);
    // const requestId: string = nanoid();
    const requestId: string = uuidv4();
    const zaadParams: WaafiRequest = {
      schemaVersion: '1.0',
      requestId,
      timestamp: moment.tz('Africa/Nairobi').format(),
      channelName: 'WEB',
      serviceName: 'API_PURCHASE',
      serviceParams: {
        // merchantUid: 'M0910153',
        // apiUserId: '1000128',
        // apiKey: 'API-1494934686AHX',
        merchantUid: this.WAAFIMERCHANTUID,
        apiUserId: this.WAAFIAPIUSERID,
        apiKey: this.WAAFIAPIKEY,
        paymentMethod: 'MWALLET_ACCOUNT',
        payerInfo: {
          //   accountNo: Number(`252${zaad.phone_number}`),
          accountNo: Number(waafiData.phone),
        },
        transactionInfo: {
          //   referenceId: `${zaad.accNo}`,
          //   invoiceId: `${requestId}`,
          //   amount: String(zaad.amount),
          //   currency: zaad.currency,
          //   description: 'Tarmiye Crowdfunding',
          referenceId: `${waafiData.accNo}`,
          invoiceId: `${requestId}`,
          amount: String(waafiData.amount),
          currency: 'USD',
          description: 'Sokaab',
        },
      },
    };
    return zaadParams;
  }

  async creatingWaafiReceipt(
    invoice: WaafiRequest,
    dtos: PaymentDto,
    res: any,
  ): Promise<any> {
    const createdAt = format(new Date(), 'M/dd/yyyy h:mm:ss a');
    const amount =
      Number(invoice.serviceParams.transactionInfo.amount) -
      Number(invoice.serviceParams.transactionInfo.amount) * 0.01;
    const ChargeAmount = String(
      Number(invoice.serviceParams.transactionInfo.amount) * 0.01,
    );

    try {
      await this.prisma.receipts.create({
        data: {
          TranNo: invoice.serviceParams.transactionInfo.invoiceId,
          AccNo: invoice.serviceParams.transactionInfo.referenceId,
          Category: 'ZAAD',
          //   CustomerName: String(invoice.serviceParams.payerInfo.accountNo),
          //   Narration: String(invoice.serviceParams.payerInfo.accountNo),
          // CustomerName: `${dtos.name} - ${dtos.phone}`,
          // Narration: String(
          //   `${dtos.name} donated ${ChargeAmount} to the project with id of ${dtos.project_id} using ${dtos.service}`,
          // ),
          CustomerName: dtos.name,
          Narration: dtos.phone,
          TranAmt: new Decimal(amount),
          UserID: 'PUBLIC',
          ChargeAmount,
          DrCr: 'cr',
          CurrencyCode: 'USD',
          TranDate: createdAt,
        },
      });
      return res.status(200).send({
        status: 'success',
      });
    } catch (err) {
      throw new HttpException(
        'Receipt did not successfully added',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
  }

  async initiatingWaafiPaymentApi(invoice: WaafiRequest): Promise<any> {
    return lastValueFrom(
      this.http
        .post('https://api.waafipay.net/asm', invoice)
        .pipe(map((res) => res.data)),
    );
  }

  async payWaafi(dtos: PaymentDto, res: any): Promise<any> {
    const waafiInvoice = this.preparingWaafiParams(dtos);
    console.log('&&&&', waafiInvoice);
    try {
      const zaadRes = await this.initiatingWaafiPaymentApi(waafiInvoice);
      console.log('^^^^', zaadRes);

      if (
        zaadRes.responseCode === '2001' &&
        zaadRes.responseMsg === 'RCS_SUCCESS'
      ) {
        //  Creating Reciept After successful payment
        this.creatingWaafiReceipt(waafiInvoice, dtos, res);
      } else if (zaadRes.responseCode === '5310') {
        // Payment rejection
        throw new HttpException(
          'Payment was rejected. Please complete the process on your phone.',
          HttpStatus.EXPECTATION_FAILED,
        );
      } else if (
        zaadRes.responseCode === '5206' &&
        zaadRes.responseMsg === 'Payment Failed (waa khalad numberka PIN-ka ah)'
      ) {
        // Incorrect PIN
        throw new HttpException(
          'Payment failed due to an incorrect PIN number.',
          HttpStatus.EXPECTATION_FAILED,
        );
      } else if (
        zaadRes.responseCode === '5206' &&
        zaadRes.responseMsg === 'Payment Failed (Hadhaagaagu kuguma filna).'
      ) {
        // Insufficient balance
        throw new HttpException(
          'Payment failed due to insufficient balance',
          HttpStatus.EXPECTATION_FAILED,
        );
      } else {
        throw new HttpException(
          'Transaction Failed',
          HttpStatus.EXPECTATION_FAILED,
        );
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.EXPECTATION_FAILED);
    }
  }

  //** Edahab Payment Gateway */
  preparingEdahabParams(edahabData: any, dtos: PaymentDto) {
    console.log('1- Preparing edahab params', edahabData);
    // console.log('edahab datea ---->>', edahabData);

    const currentInvoiceData = omit(edahabData, 'ApiSecret');

    const invoice_uuid: string = uuidv4();
    currentInvoiceData['ThirdPartyInvoiceNo'] = invoice_uuid;

    const returnUrl = `https://www.tarmiye.com/validate-contribution?project_id=${dtos.project_id}&invoice_id=${invoice_uuid}`;
    currentInvoiceData['ReturnUrl'] = returnUrl;

    const jsonQuery = JSON.stringify(currentInvoiceData);
    const eDahabHash = createHash('sha256')
      .update(jsonQuery.concat(edahabData.ApiSecret))
      .digest('hex');

    return {
      eDahabHash,
      invoice_uuid,
      currentInvoiceData,
    };
  }

  async issueInvoice(hash: string, invoiceQuery: any): Promise<any> {
    console.log('2- Invoicing params');
    // console.log('hash: ----> ', hash);
    // console.log('invoiceQuery: ----> ', invoiceQuery);

    // this.logger.log(
    //   `Edahab number length: ${invoiceQuery.edahabNumber.length}`,
    // );
    const edahabUrl = `https://www.edahab.net/api/api/IssueInvoice?hash=${hash}`;
    return lastValueFrom(
      this.http.post(edahabUrl, invoiceQuery).pipe(
        map((res) => {
          return res.data;
        }),
      ),
    );
  }

  async successInvoice(
    invoice_id: number,
    project_id: number,
    donated_by: string,
    amount: Decimal,
    edahab_account: string,
    invoiceGuid: string,
    status: string,
  ): Promise<any> {
    console.log('3- creating invoice to edahb');
    const edahabInvoice = await this.prisma.projecteDahab_invoices.create({
      data: {
        project_id,
        donated_by,
        status,
        amount,
        edahab_account,
        added_on: new Date(),
        invoiceGuid,
      },
    });
    return edahabInvoice;
  }

  async payEdahab(dtos: PaymentDto, res: any): Promise<any> {
    // Getting if the project has account keys(project keys)
    // const projectKey = await this.prisma.project_keys.findFirst({
    //   where: {
    //     project_id: dtos.project_id,
    //     // project_id: 66,
    //     // project_id: 76,
    //   },
    //   select: {
    //     merchantShortCode: true,
    //     apiSecret: true,
    //     apiKey: true,
    //   },
    // });

    // if (project_keys && project_keys.merchantShortCode) {
    // } else {
    // }

    // Saving to project leads
    await this.prisma.project_leads.create({
      data: {
        project_id: dtos.project_id,
        mobile_number: dtos.phone,
        name: dtos.name,
        amount: dtos.amount,
        added_on: new Date(),
        method: dtos.bank,
        // method: 'E-DAHAB',
      },
    });

    // if (projectKey) console.log('Note: YES project key');
    // else console.log('Note: N0 project key');
    // const agentCode =
    //   projectKey && projectKey?.merchantShortCode
    //     ? projectKey?.merchantShortCode
    //     : dtos.accNo;

    // const currentApiKey =
    //   projectKey && projectKey?.apiKey
    //     ? projectKey?.apiKey
    //     : this.TARMIYE_API_KEY;

    // const currentApiSecret =
    //   projectKey && projectKey?.apiSecret
    //     ? projectKey?.apiSecret
    //     : this.TARMIYE_API_SECRET;

    // const agentCode = '77720';
    // const currentApiKey = 'IWN8d8qo0XiSQO1KN5cgzaCZ1unPf6kfmG9d0bwGN';
    // const currentApiSecret = 'rQrISGI8PV3hJdvgHzCxIyjP1jnXzQS1zkY70W';
    const agentCode = '738787';
    const currentApiKey = 'sGKjOmAoQznQb34xLvzW4ZbacKBOyNcvDmXn8EYzR';
    const currentApiSecret = 'bfPjulrc7V649W1F8ELB6MXHG5z7kt76juiKW0';

    // const currentApiKey = 'zmWMHxhFkA56n31EbAQj6n31EbAQj81080';
    // const currentApiSecret = 'e9d935ce63a59404acb8e10aaab44faf454';

    // Preparing the invocie
    const edahabInvoice = this.preparingEdahabParams(
      {
        // AgentCode: isTarmiye ? TARMIYE_SHORTCODE_PREFIX : merchantShortCode,
        // ApiKey: isTarmiye ? tarmiyeApiKey : apiKey,
        // ApiKey: isTarmiye ? tarmiyeApiKey : apiKey,

        // AgentCode: project_keys?.merchantSh ortCode,
        // ApiKey: this.API_KEY,

        AgentCode: agentCode,
        ApiKey: currentApiKey,
        ApiSecret: currentApiSecret,
        Currency: 'USD',
        Amount: dtos.amount,
        // edahabNumber: dtos.phone,
        edahabNumber: dtos.phone.substring(3),
      },
      dtos,
    );

    // console.log('**********', edahabInvoice);
    const edahabHash: string = edahabInvoice.eDahabHash;
    const currentInvoiceData = edahabInvoice.currentInvoiceData;

    // Issueing the invoice
    const edahabRes = await this.issueInvoice(edahabHash, currentInvoiceData);
    console.log('------', edahabRes);

    // Saving the invoice the local database
    const projectAccountInvoice = await this.successInvoice(
      edahabRes.InvoiceId,
      dtos.project_id,
      `${dtos.phone} - ${edahabRes.InvoiceId}`,
      new Decimal(dtos.amount),
      // agentCode,
      dtos.accNo,
      // currentInvoiceData.invoice_uuid,
      edahabInvoice.invoice_uuid,
      edahabRes.InvoiceStatus,
    );

    if (edahabRes.StatusCode == 0 && edahabRes.InvoiceStatus == 'Paid') {
      this.creatingEdahabReceipt(
        {
          ...projectAccountInvoice,
          name: dtos.name,
          project_id: dtos.project_id,
          service: dtos.service,
        },
        res,
      );
    } else {
      throw new HttpException(
        'Transaction Failed',
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    // switch (edahabRes.StatusCode) {
    //   case 0: {
    //     this.successInvoice(
    //       currentInvoiceData.invoice_uuid,
    //       dtos.project_id,
    //       dtos.phone,
    //       new Decimal(dtos.amount),
    //       agentCode,
    //       currentInvoiceData.invoice_uuid,
    //     );

    //     return res.status(200).send({
    //       status: 'initiated',
    //       message: `https://www.edahab.net/api/Payment?invoiceId=${edahabRes.InvoiceId}`,
    //     });
    //   }
    //   case 3: {
    //     res.status(400).send(edahabRes);
    //   }
    //   case 5: {
    //     return res.status(200).send({
    //       status: 'insufficient-balance',
    //       message: 'Insufficient balance',
    //     });
    //   }
    //   default:
    //     return res.status(200).send(edahabRes);
    // }

    // return edahabRes;
    // throw new NotFoundException();
    // throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
  }

  async creatingEdahabReceipt(invoice: any, res: any): Promise<any> {
    const createdAt = format(new Date(), 'M/dd/yyyy h:mm:ss a');
    const {
      id,
      invoiceGuid,
      edahab_account,
      donated_by,
      amount,
      name,
      // project_id,
      // service,
    } = invoice;

    // splittin the donated by becuase i also saved the invoice id on it
    const actual_donated_by = donated_by.split(' - ')[0];

    const receiptQ = this.prisma.receipts.create({
      data: {
        TranNo: invoiceGuid,
        AccNo: edahab_account,
        Category: 'EDAHAB',
        // CustomerName: `${name} - ${actual_donated_by}`,
        // // Narration: donated_by,
        // Narration: String(
        //   `${name} donated ${amount} to the project with id of ${project_id} using ${service}`,
        // ),
        CustomerName: name,
        Narration: actual_donated_by,
        TranAmt: amount,
        UserID: 'PUBLIC',
        DrCr: 'cr',
        CurrencyCode: 'USD',
        TranDate: createdAt,
      },
    });
    const updateEdahabQ = this.prisma.projecteDahab_invoices.update({
      where: {
        id,
      },
      data: {
        status: 'Paid',
      },
    });
    await this.prisma.$transaction([receiptQ, updateEdahabQ]);
    return res.status(200).send({
      status: 'paid',
    });
  }

  async checkEdahabStatusInvoice(
    edahabAccount: string,
    invoice_id: number,
  ): Promise<any> {
    const edahabRequest = {
      invoiceId: String(invoice_id),
      // apiKey: this.isTarmiyeShortCode(edahabAccount) ? tarmiyeApiKey : apiKey,
      apiKey: this.API_KEY,
    };
    const edahabJSON = JSON.stringify(edahabRequest);
    const eDahabHash = createHash('sha256')
      // .update( edahabJSON.concat(this.isTarmiyeShortCode(edahabAccount) ? tarmiyeApiSecret : apiSecret ) )
      .update(edahabJSON.concat(this.API_SECRET))
      .digest('hex');
    const edahabUrl = `https://www.edahab.net/api/api/CheckInvoiceStatus?hash=${eDahabHash}`;
    return lastValueFrom(
      this.http.post(edahabUrl, edahabRequest).pipe(
        map((res) => res.data),
        // catchError((error) => {
        //   // Handle the error here
        //   console.log(error);
        //   throw new Error('Failed to check Edahab status');
        // }),
      ),
    );
  }

  async checkEdahabInvoice(
    project_id: string,
    invoiceGuid: string,
    res: any,
  ): Promise<any> {
    const invoice = await this.prisma.projecteDahab_invoices.findFirst({
      where: {
        status: 'Pending',
        invoiceGuid,
        project_id: Number(project_id),
      },
      select: {
        id: true,
        invoice_id: true,
        edahab_account: true,
        donated_by: true,
        amount: true,
        invoiceGuid: true,
      },
    });
    if (invoice && invoice.edahab_account && invoice.invoice_id) {
      const edahabRes = await this.checkEdahabStatusInvoice(
        invoice.edahab_account,
        invoice.invoice_id,
      );
      if (edahabRes.InvoiceStatus == 'Paid') {
        this.creatingEdahabReceipt(invoice, res);
      } else {
        return res.status(200).send({
          status: 'not-found',
        });
      }
    } else {
      return res.status(200).send({
        status: 'not-found',
      });
    }
  }

  //** Paystack Payment Gateway */
  async sendPaystackRequest(
    email: string,
    name: string,
    reference: string,
    amount: number,
  ) {
    const url = 'https://api.paystack.co/transaction/initialize'; // Paystack API Payment endpoint
    const data: PaystackRequest = {
      email,
      name,
      amount: amount.toString(),
      reference,
      currency: 'USD',
      // callback_url: `${process.env.PAYSTACK_CALLBACK_URL}`,
      // callback_url: `http://localhost:3001/payment/verify-paystack?reference=${reference}`,
      callback_url: `${process.env.PAYSTACK_CALLBACK_URL}${reference}`,
      channels: ['card', 'mobile_money'],
    };

    const headers = {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, // replace with actual secret key
      'Content-Type': 'application/json',
    };

    try {
      return lastValueFrom(
        this.http.post(url, data, { headers }).pipe(
          map((res) => {
            return res.data;
          }),
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  async payWithPaystack(dtos: PaystackDto, res: any): Promise<any> {
    const reference = uuidv4();
    // const actualAmount = parseInt(dtos.amount) / 100;
    const actualAmount2 = (parseFloat(dtos.amount) * 100).toString(); // This one is right

    // Saving into paystack transaction
    const backerInfo = `${dtos.email} - ${dtos.name}`;
    const prePaystackSavedTransaction =
      await this.prisma.paystack_transaction.create({
        data: {
          project_id: dtos.project_id,
          // acc_no: dtos.accNo,
          reference,
          email: backerInfo,
          amount: dtos.amount,
          // created_at: new Date(),
          created_at: moment.tz('Africa/Nairobi').format(),
        },
      });

    if (!prePaystackSavedTransaction)
      throw new HttpException(
        'Failed to insert Transaction into database. Please try again later',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    // Dealing with paystack transaction
    try {
      const paystackResponse = await this.sendPaystackRequest(
        dtos.email,
        dtos.name,
        reference,
        // parseInt(dtos.amount),
        parseInt(actualAmount2),
      );

      if (paystackResponse.status) {
        res.status(200).json({
          status: 'initiated',
          url: paystackResponse.data.authorization_url,
          others: paystackResponse.data,
        });
      } else {
        // Deleting the paystack transaction we created
        await this.prisma.paystack_transaction.delete({
          where: {
            id: prePaystackSavedTransaction.id,
          },
        });
        res
          .status(500)
          .json({ statusCode: 500, message: 'Failed with paystack response' });
      }
    } catch (error) {
      // Deleting the paystack transaction we created
      await this.prisma.paystack_transaction.delete({
        where: {
          id: prePaystackSavedTransaction.id,
        },
      });

      if (error.response.data)
        throw new HttpException(
          error.response.data.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      else
        throw new HttpException(
          'Failed with paystack response',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  async sendingVerifyPaystackRequest(ref: string) {
    // Verify the payment transaction from the paystack
    const url = `https://api.paystack.co/transaction/verify/${ref}`;
    const headers = {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    };

    // Calling the api
    return lastValueFrom(
      this.http.get(url, { headers }).pipe(
        map((res) => {
          return res.data;
        }),
        catchError((error) => {
          if (error.response.data)
            throw new HttpException(
              error.response.data.message,
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          else
            throw new HttpException(
              'Failed with paystack response',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }),
      ),
    );
  }

  async verifyingPaystackPayment(ref: string, res: any) {
    // Check if the reference is valid uuidv4

    // if (isUUIDv4(ref)) {
    //   throw new HttpException(
    //     'Sorry, we could not verify your payment',
    //     HttpStatus.NOT_FOUND,
    //   );
    // }

    // Check if the refenence exist in the paystack transaction
    const currentPaystackTransaction =
      await this.prisma.paystack_transaction.findFirst({
        where: {
          reference: ref.toUpperCase(),
        },
      });

    if (!currentPaystackTransaction)
      throw new HttpException(
        `Transaction with reference ${ref} not found.`,
        HttpStatus.NOT_FOUND,
      );

    if (currentPaystackTransaction.status === 'pending') {
      const verifyResponse = await this.sendingVerifyPaystackRequest(
        ref.toLowerCase(),
      );

      // When transaction paid((successful verification))
      if (verifyResponse.data.status === 'success') {
        // Updating the paystack transaction
        await this.prisma.paystack_transaction.update({
          where: {
            id: currentPaystackTransaction.id,
          },
          data: {
            status: 'approved',
            updated_at: new Date(),
          },
        });

        // Inserting this transaction into the receipts
        const createdAt = format(new Date(), 'M/dd/yyyy h:mm:ss a');
        const custName =
          currentPaystackTransaction.email?.split(' - ')[1] ?? 'Anonymous';
        const custAccount =
          currentPaystackTransaction.email?.split(' - ')[0] ?? 'Anonymous';

        const project_account = await this.prisma.project_accounts.findFirst({
          where: {
            bankId: 'Paystack',
            project_Id: currentPaystackTransaction.project_id,
           
           
          },
        });
              const project = await this.prisma.projects.findUnique({
  where: {
    project_id: currentPaystackTransaction.project_id ?? undefined,
  },
  select: { title: true },
});


        await this.prisma.receipts.create({
          data: {
            TranNo: ref.toUpperCase(),
            // AccNo: currentPaystackTransaction.acc_no,
            AccNo: project_account?.AccNo,
            // Category: 'PAYSTACK',
            Category: 'CARD',
            // CustomerName: String(dtos.name),
            // CustomerName: 'Anonymous',
            // Narration: String(
            //   `${dtos.name} donated ${ChargeAmount} to the project with id of ${dtos.project_id} using ${dtos.service}`,
            // ),

            CustomerName: custName,
            Narration: custAccount,

            TranAmt: currentPaystackTransaction.amount
              ? currentPaystackTransaction.amount
              : 0,
            UserID: 'PUBLIC',
            // ChargeAmount: 0.0,
            DrCr: 'cr',
            CurrencyCode: 'USD',
            TranDate: String(createdAt),
          },
        });


        // --- NEW: send receipt email (non-blocking but awaited so tests see it) ---


        try {
          // get donor email from the saved transaction (the string is "email - name")
          const donorEmail = currentPaystackTransaction.email?.split(' - ')[0] ?? null;
          const donorName = currentPaystackTransaction.email?.split(' - ')[1] ?? null;

          if (donorEmail) {
            const { previewUrl } = await this.sendPaystackReceiptEmail({
              toEmail: donorEmail,
              toName: donorName ?? undefined,
              projectId: currentPaystackTransaction.project_id ?? undefined,
              reference: ref.toUpperCase(),
              amount: Number(currentPaystackTransaction.amount ?? 0),
              tranDate: String(createdAt),
              projectName: project?.title ?? undefined
            });

            if (previewUrl) {
              // make it easy to see in logs while testing with Ethereal
              this.logger.log(`Ethereal preview URL: ${previewUrl}`);
            }
          } else {
            this.logger.warn('Donor email missing; could not send receipt email.');
          }
        } catch (emailErr) {
          // Log but don't fail the whole verification in case email fails
          this.logger.error('Error sending receipt email', emailErr);
        }
        // --- END NEW ---
        res.status(200).send({
          statusCode: '200',
          message: 'Your Paystack transaction has been verified. Thank you!',
          project_id: currentPaystackTransaction.project_id,
        });
      } else {
        // when transaction is not paid(unsuccessful verification)
        res.status(500).send({
          statusCode: '500',
          message:
            'Verifying your Paystack transaction failed. Please try again!',
          project_id: currentPaystackTransaction.project_id,
          service: 'paystack',
        });
      }
    } else {
      res.status(500).send({
        statusCode: '500',
        message: 'This transaction has already been verified.',
        project_id: currentPaystackTransaction.project_id,
        service: 'paystack',
      });
    }
  }












    /**
   * Send a receipt email to donor after Paystack verification.
   * Uses SMTP settings from env (falls back to provided constants).
   */
  private async sendPaystackReceiptEmail(params: {
    toEmail: string;
    toName?: string;
    projectId?: number;
    reference: string;
    amount: number; // amount in USD (for display)
    tranDate: string; // already formatted date string
    projectName?: string;
  }) {
    // 1) Build transporter from env (use Ethereal for testing)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 2) Compute fee & net amount (3.8% fee)
    // We do the arithmetic carefully:
    // fee = amount * 0.038, rounded to 2 decimals
    const rawAmount = Number(params.amount);
    const feeRaw = rawAmount * 0.038; // precise raw
    const fee = Math.round(feeRaw * 100) / 100; // round to cents
    const net = Math.round((rawAmount - fee) * 100) / 100;

    // 3) Create HTML email (simple, safe)
    // const html = `
    //   <div style="font-family: Arial, Helvetica, sans-serif; line-height:1.4; color:#222;">
    //     <h2>Thank you for your donation${params.toName ? `, ${params.toName}` : ''}!</h2>
    //     <p>We received your donation. Below are the details:</p>

    //     <table cellpadding="6" cellspacing="0" style="border-collapse:collapse; width:100%; max-width:600px;">
    //       <tr>
    //         <td style="border-top:1px solid #eee;"><strong>Transaction reference</strong></td>
    //         <td style="border-top:1px solid #eee;">${params.reference}</td>
    //       </tr>
    //       <tr>
    //         <td><strong>Project ID</strong></td>
    //         <td>${params.projectId ?? 'N/A'}</td>
    //       </tr>
    //       <tr>
    //         <td><strong>Date</strong></td>
    //         <td>${params.tranDate}</td>
    //       </tr>
    //       <tr>
    //         <td><strong>Gross amount</strong></td>
    //         <td>$${rawAmount.toFixed(2)}</td>
    //       </tr>
    //       <tr>
    //         <td><strong>Paystack fee (3.8%)</strong></td>
    //         <td>$${fee.toFixed(2)}</td>
    //       </tr>
    //       <tr>
    //         <td><strong>Net amount received</strong></td>
    //         <td><strong>$${net.toFixed(2)}</strong></td>
    //       </tr>
    //     </table>

    //     <p style="margin-top:16px;">
    //       If you need an official receipt or have questions, reply to this email.
    //     </p>

    //     <p style="margin-top:16px;">
    //       Cheers,<br/>
    //       The Sokaab Team
    //     </p>
    //   </div>
    // `;
    const html = `
  <div style="font-family: Roboto, sans-serif; background-color:#f9fafb;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:700px; margin:auto; background:#fff; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.1); overflow:hidden;">
      
      <!-- Header -->
      <tr>
        <td style="background:linear-gradient(135deg, #00CC99, #00CC99); padding:24px; color:#fff;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:22px; font-weight:600; color:white">Sokaab Donation Receipt</td>
             
            </tr>
          </table>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:32px;">
          <h2 style="margin:0 0 16px; font-size:20px; font-weight:600; color:#111;">
            Thank you, ${params.toName ?? "Donor"}!
          </h2>
          <p style="margin:0 0 24px; font-size:15px; color:#444; line-height:1.6;">
            This receipt confirms your generous donation to 
            <strong style="color:#2C3E50;">${params.projectName ?? `Project ${params.projectId ?? ''}`}</strong>.  
            We are truly grateful for your support.
          </p>

          <!-- Donor Details -->
          <h3 style="margin:24px 0 8px; font-size:16px; color:#2C3E50; border-bottom:2px solid #e5e7eb; padding-bottom:4px;">Donor Details</h3>
          <p style="margin:4px 0; font-size:14px; color:#333;">
            <strong>Name:</strong> ${params.toName ?? "N/A"}<br/>
            <strong>Email:</strong> ${params.toEmail}
          </p>

          <!-- Donation Details -->
          <h3 style="margin:32px 0 8px; font-size:16px; color:#2C3E50; border-bottom:2px solid #e5e7eb; padding-bottom:4px;">Donation Details</h3>
          <table cellpadding="10" cellspacing="0" width="100%" style="border-collapse:collapse; font-size:14px; margin-bottom:24px;">
            <tr style="background:#f3f4f6;">
              <td style="font-weight:600; width:200px;">Transaction Reference</td>
              <td>${params.reference}</td>
            </tr>
            <tr>
              <td style="font-weight:600;">Project Id</td>
              <td>${params.projectId ?? '#'}</td>    
                 
            </tr>
            <tr>
              <td style="font-weight:600;">Project Name</td>
              <td>${params.projectName ?? 'Sokaab Project'}</td>    
                 
            </tr>
            <tr style="background:#f3f4f6;">
              <td style="font-weight:600;">Date</td>
              <td>${params.tranDate}</td>
            </tr>
            <tr>
              <td style="font-weight:600;">Gross Amount</td>
              <td>$${rawAmount.toFixed(2)}</td>
            </tr>
            <tr style="background:#f3f4f6;">
              <td style="font-weight:600;">Paystack Fee (3.8%)</td>
              <td>-$${fee.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="font-weight:600;">Net Amount Received</td>
              <td><strong style="color:#16a34a;">$${net.toFixed(2)}</strong></td>
            </tr>
          </table>

          <p style="font-size:14px; color:#444; line-height:1.6;">
            If you need further assistance, reply directly to this email.
          </p>

          <p style="margin-top:32px; font-size:14px; color:#444;">
            With gratitude,<br/>
            <strong>The Sokaab Team</strong>
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#00CC99; padding:16px; text-align:center; font-size:12px; color:#2C3E50;">
          © ${new Date().getFullYear()} Sokaab. All Rights Reserved.<br/>
          Building hope, one project at a time.
        </td>
      </tr>
    </table>
  </div>
`;


    // 4) Prepare mail options
    const mailOptions = {
      from: `"Sokaab Support" <${process.env.SMTP_USER}>`,
      to: params.toEmail,
      subject: `Thank you for your donation`,
      html,
    };

    // 5) Send and return result (also log preview URL for Ethereal)
    const info = await transporter.sendMail(mailOptions);

    // nodemailer provides getTestMessageUrl for Ethereal
    const previewUrl = (nodemailer as any).getTestMessageUrl(info) ?? null;
    this.logger.log(`Receipt email sent to ${params.toEmail}; messageId=${info.messageId}`);
    if (previewUrl) {
      this.logger.log(`Preview the email here: ${previewUrl}`);
    }
    return { info, previewUrl };
  }



  
}
