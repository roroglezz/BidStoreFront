import { Routes } from '@angular/router';
import { isAuthenticatedGuard } from './guards/auth.guard';
import { isAdminGuard } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CategoryPageComponent } from './components/categories/category-page/category-page.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ShowProductComponent } from './components/products/show-product/show-product.component';
import { AdminComponent } from './components/admin/admin.component';
import { CategoriesComponent } from './components/admin/categories/categories.component';
import { UsersComponent } from './components/admin/users/users.component';
import { SubcategoriesComponent } from './components/admin/subcategories/subcategories.component';
import { ConditionsComponent } from './components/admin/conditions/conditions.component';
import { ProductsComponent } from './components/admin/products/products.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { PaymentGatewayComponent } from './components/payment-gateway/payment-gateway.component';
import { MessagesComponent } from './components/messages/messages.component';
import { MessagesAdminComponent } from './components/admin/messages-admin/messages-admin.component';
import { UploadProductComponent } from './components/products/upload-product/upload-product.component';
import { ListAuctionsComponent } from './components/auctions/list-auctions/list-auctions.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuctionsComponent } from './components/admin/auctions/auctions.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: '404', component: NotFoundComponent },
    { path: 'home', component: HomeComponent, canActivate: [isAuthenticatedGuard] },
    { path: 'category/:id', component: CategoryPageComponent,canActivate: [isAuthenticatedGuard] },
    { path: 'product/:id', component: ShowProductComponent,canActivate: [isAuthenticatedGuard] },
    { path: 'uploadProduct', component: UploadProductComponent,canActivate: [isAuthenticatedGuard] },
    { path: 'auctions', component: ListAuctionsComponent,canActivate: [isAuthenticatedGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [isAuthenticatedGuard] },
    { path: 'admin', component: AdminComponent, canActivate: [isAdminGuard] },
    { path: 'admin/categories', component: CategoriesComponent, canActivate: [isAdminGuard] },
    { path: 'admin/users', component: UsersComponent, canActivate: [isAdminGuard] },
    { path: 'admin/subcategories', component: SubcategoriesComponent, canActivate: [isAdminGuard] },
    { path: 'admin/conditions', component: ConditionsComponent, canActivate: [isAdminGuard] },
    { path: 'admin/products', component: ProductsComponent, canActivate: [isAdminGuard] },
    { path: 'admin/messages', component: MessagesAdminComponent, canActivate: [isAdminGuard] },
    { path: 'admin/auctions', component: AuctionsComponent, canActivate: [isAdminGuard] },
    { path: 'unauthorized', component: UnauthorizedComponent},
    { path: 'payment-gateway', component: PaymentGatewayComponent, canActivate: [isAuthenticatedGuard] },
    { path: 'messages', component: MessagesComponent, canActivate: [isAuthenticatedGuard] },
    { path: '**', component: NotFoundComponent }
];