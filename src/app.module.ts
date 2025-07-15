import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { OnModuleInit } from '@nestjs/common';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { CartModule } from './cart/cart.module';
import { WhishlistModule } from './whishlist/whishlist.module';
import { OrderModule } from './order/order.module';
import { AddressModule } from './address/address.module';
import { CmsModule } from './cms/cms.module';
import { WalletModule } from './wallet/wallet.module';
import { BrandModule } from './brand/brand.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    AuthModule,
    ProductModule,
    CategoryModule,
    CartModule,
    WhishlistModule,
    OrderModule,
    AddressModule,
    CmsModule,
    WalletModule,
    BrandModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements OnModuleInit {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  onModuleInit() {
    this.connection.once('open', () => {
      console.log('MongoDB connected');
    });
  }
}
