import libraryImg     from '@/assets/img/library.png'
import studentHallImg from '@/assets/img/student.png'
import mainHallImg    from '@/assets/img/total.png'
import amaranImg      from '@/assets/img/ama.png'
import gateImg        from '@/assets/img/front.png'
import futureImg      from '@/assets/img/future.png'
import humanImg       from '@/assets/img/human.png'
import ictImg         from '@/assets/img/sw.png'
import baseballImg    from '@/assets/img/baseball.png'
import stadiumImg     from '@/assets/img/bigplace.png'

export const LOCATION_META = {
  '도서관':           { id: 1,  image: libraryImg,     lat: 37.2450, lng: 127.0365 },
  '학생회관':         { id: 2,  image: studentHallImg, lat: 37.2445, lng: 127.0350 },
  '종합관':           { id: 3,  image: mainHallImg,    lat: 37.2455, lng: 127.0360 },
  '아마랜스홀':       { id: 4,  image: amaranImg,      lat: 37.2440, lng: 127.0375 },
  '정문':             { id: 5,  image: gateImg,        lat: 37.2425, lng: 127.0355 },
  '미래혁신관':       { id: 6,  image: futureImg,      lat: 37.2460, lng: 127.0345 },
  '인문사회융합대학': { id: 7,  image: humanImg,       lat: 37.2458, lng: 127.0330 },
  'ICT융합대학':      { id: 8,  image: ictImg,         lat: 37.2448, lng: 127.0385 },
  '야구장':           { id: 9,  image: baseballImg,    lat: 37.2435, lng: 127.0390 },
  '대운동장':         { id: 10, image: stadiumImg,     lat: 37.2430, lng: 127.0370 },
}