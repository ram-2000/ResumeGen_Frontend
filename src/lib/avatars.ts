export const sampleAvatars = [
  "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png",
  "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png",
  "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png",
  "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-4.png",
  "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png",
  "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-6.png",
  "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-7.png",
  "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-8.png",
];

export const getRandomAvatar = () => {
  return sampleAvatars[Math.floor(Math.random() * sampleAvatars.length)];
}; 