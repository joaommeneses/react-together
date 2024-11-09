import { reactLogo, viteLogo, reactTogetherLogo } from '@assets'

const logos = {
  react: {
    src: reactLogo,
    link: 'https://reactjs.org',
  },
  vite: {
    src: viteLogo,
    link: 'https://vitejs.dev',
  },
  reacttogether: {
    src: reactTogetherLogo,
    link: 'https://reacttogether.dev',
  },
}

type HeroLogoProps = {
  type: keyof typeof logos
  size?: number
}
export default function HeroLogo({ type, size = 10 }: HeroLogoProps) {
  return (
    <a {...{ href: logos[type].link, target: '_blank' }}>
      <img
        {...{
          src: logos[type].src,
          alt: `${type}-logo`,
          className: `logo ${type}`,
          style: {
            width: `${size}rem`,
            height: `${size}rem`,
          },
        }}
      />
    </a>
  )
}
