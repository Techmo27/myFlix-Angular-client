import { Component, OnInit } from '@angular/core';
import { UserRegistrationService } from '../fetch-api-data.service';
import { GenreComponent } from '../genre/genre.component';
import { DirectorComponent } from '../director/director.component';
import { SynopsisComponent } from '../synopsis/synopsis.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent {

  movies: any[] = [];
  user: any = localStorage.getItem('user');
  favorites: any[] = [];


  constructor(
    public fetchApiData: UserRegistrationService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.getMovies();

  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  openGenre(name: string, description: string): void {
    this.dialog.open(GenreComponent, {
      data: {
        name: name,
        description: description,
      },
      width: '450px'
    });
  }

  openDirector(name: string, bio: string, birth: string): void {
    this.dialog.open(DirectorComponent, {
      data: {
        name: name,
        bio: bio,
        birth: birth
      },
      width: '450px'
    });
  }

  openSynopsis(title: string, description: string): void {
    this.dialog.open(SynopsisComponent, {
      data: {
        title: title,
        description: description
      },
      width: '450px'
    });
  }

  addFavorites(movieID: string, title: string): void {
    this.fetchApiData.addFavoriteMovies(movieID).subscribe((result: any) => {
      this.snackBar.open('The movie was successfully added to your favorites.', 'OK', {
        duration: 2000,
      });
      this.ngOnInit();
    });
  }
}