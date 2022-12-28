export class PlainSocketEventBody {
  access_token: string;
}

export class CreateRoomBody extends PlainSocketEventBody {
  room_name: string;
}
