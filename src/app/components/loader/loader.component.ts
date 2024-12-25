import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit{
  isLoading = false;
  constructor(private loadingService:LoadingService) {

   }

  ngOnInit(): void {
    this.loadingService.getLoaderState().subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
  }
}
