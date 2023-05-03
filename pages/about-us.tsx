"use server";
import React, { useEffect, useRef } from 'react';
import { Typography } from '@mui/material';
import Tabs from '../components/utils/Tabs';
import Slider from '../components/utils/Slider';
import MetaTags from '../components/utils/MetaTags';
import { GetServerSideProps } from 'next';
import FAQ from '../components/layout/FAQ';
import ScrollableHorizontalList from '../components/layout/ScrollableHorizontalList';
import Section from '../components/utils/Section';
import TwitchAnimation from '../components/TwitchAnimation';
import Player from '../components/layout/Player';
import useLessThenMediaQuery from '../libs/hooks/useLessThenMediaQuery';

const AboutUs = () => {
  const songURLResultRef = useRef<string[]>([]);
  const { isScreenWidthLessThen650 } = useLessThenMediaQuery(650)

  useEffect(() => {
    let dataBlob = null;
    try {
      fetch("/music/Californication.mp3")
        .then(res => res.blob())
        .then(data => {
          dataBlob = data;
          let reader = new FileReader();
          reader.onload = (e) => {
            console.log('Californication', e, e.target!.result)
            songURLResultRef.current.push(e.target!.result as string);
          };
          reader.readAsDataURL(dataBlob);
        });

      fetch("/music/Dead_Voxel_C418.mp3")
        .then(res => res.blob())
        .then(data => {
          dataBlob = data;
          let reader = new FileReader();
          reader.onload = (e) => {
                  console.log('data', e, e.target!.result)
            songURLResultRef.current.push(e.target!.result as string);
          };
          reader.readAsDataURL(dataBlob);
        });

      fetch("/music/Calme - Ever So Blue.mp3")
        .then(res => res.blob())
        .then(data => {
          dataBlob = data;
          let reader = new FileReader();
          reader.onload = (e) => {
            console.log('data', e, e.target!.result)
            songURLResultRef.current.push(e.target!.result as string);
          };
          reader.readAsDataURL(dataBlob);
        });
    } catch (e) {
      console.warn('data', e);
    }
  }, []);

  return (
    <>
      <MetaTags title="About Us"
                desc="Find out why we are so successful and promising team of progressive and constant progress!" />
      <section>
        <Section title="About Us" headerType="big">
          <Typography style={{ fontSize: 18 }} variant="body2">
            {ABOUT_US_TEXT}
          </Typography>
        </Section>

        <Section title="Some details...">
          <Tabs tabsData={TABS_DATA} />
        </Section>

        <Section title="Our partners">
          <Slider sliderData={PARTNERS_DATA} />
        </Section>

        <Section title="Our Clients (draggable)">
          <ScrollableHorizontalList data={CLIENTS_LIST_DATA} />
        </Section>

        <Section title="Faq">
          <FAQ dropdownsData={FAQ_DROPDOWNS_DATA}>
            {!isScreenWidthLessThen650 && <TwitchAnimation />}
          </FAQ>
        </Section>

        <Section title='Player'><Player srcs={songURLResultRef.current} /></Section>
      </section>
    </>
  );
};

export default AboutUs;

const TABS_DATA = [
  {
    title: "Abilities",
    content: "1lorem lorem lorem lorem lorem 1lorem lorem lorem lorem lorem1lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem "
  },
  {
    title: "Opportunities",
    content: "2lorem lorem l2lorem lorem l2lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem "
  },
  {
    title: "Achieved",
    content: "3lorem 3lorem lorem lorem l3lorem lorem lorem l3lorem lorem lorem l3lorem lorem lorem l3lorem lorem lorem l3lorem lorem lorem l3lorem lorem lorem l3lorem lorem lorem l lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem "
  },
  {
    title: "Developing",
    content: "4lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem "
  }

];

const PARTNERS_DATA = [
  {
    img: "Mamont Solutions"
  }, {
    img: "Billy Herrington Nico-Nico Ancestors"
  }, {
    img: "Aboba Inc"
  }, {
    img: "Suhach & Co"
  }, {
    img: "Bipolar Order Partners"
  }, {
    img: "Zhmih Ltd"
  }
];

const ABOUT_US_TEXT = `We are an interdisciplinary team of passionate developers, researchers, and visionaries
                        worldwide -
                        Switzerland, Slovenia, the United States, Germany, Japan, India, France, South Africa, and more.
                        Our
                        diverse backgrounds allow us to think unconventionally and collectively develop innovative
                        solutions
                        to
                        challenging problems. Our team comprises experienced software engineers, systems analysts, data
                        scientists, and project managers with various educational backgrounds, including computer
                        science,
                        economics, and business administration.`;

const FAQ_DROPDOWNS_DATA = {
  general: {
    data: [{
      title: "First",
      content: "We are young and perspective, relentless and progressive devs who are pationate with enhanching current and building future, proven by our dedication to work and system stability"
    },
      { title: "Second", content: "Aboba" },
      { title: "Third", content: "Aboba2" },
      { title: "Forth", content: "Aboba3" }],
    tabTitle: "General"
  },
  writer: {
    data: [{
      title: "writerFirst",
      content: "We are young and perspective, relentless and progressive devs who are pationate with enhanching current and building future, proven by our dedication to work and system stability"
    },
      { title: "writerSecond", content: "Aboba" },
      { title: "writerThird", content: "Aboba2" },
      { title: "writerForth", content: "Aboba3" }],
    tabTitle: "Writer"
  },
  dataSharing: {
    data: [{
      title: "dataSharingFirst",
      content: "We are young and perspective, relentless and progressive devs who are pationate with enhanching current and building future, proven by our dedication to work and system stability"
    },
      { title: "dataSharingSecond", content: "Aboba" },
      { title: "dataSharingThird", content: "Aboba2" },
      { title: "dataSharingForth", content: "Aboba3" }],
    tabTitle: "Data sharing"
  },
  sozializing: {
    data: [{
      title: "First",
      content: "We are young and perspective, relentless and progressive devs who are pationate with enhanching current and building future, proven by our dedication to work and system stability"
    },
      { title: "sozializingSecond", content: "Aboba" },
      { title: "sozializingThird", content: "Aboba2" },
      { title: "sozializingForth", content: "Aboba3" }],
    tabTitle: "Experience and usage"
  }
};

const CLIENTS_LIST_DATA = [
  { img: "https://media.wired.com/photos/6348589a04d20e5d7c550aa8/master/pass/The-Last-of-Us-Makes-Players-Feel-Really-Bad.-That%E2%80%99s-Great-Games-Culture.jpg " },
  { img: "https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" },
  { img: "https://www.vandelaydesign.com/wp-content/uploads/mountain-wallpaper-20.jpg" },
  { img: "https://i.pinimg.com/736x/82/4c/75/824c75d5d8baddac1e3ab99a48b77f36.jpg" },
  { img: "https://cdn.pixabay.com/photo/2016/05/24/16/48/mountains-1412683__340.png" },
  { img: "https://media.istockphoto.com/id/476098860/vector/wonderful-morning-in-the-blue-mountains.jpg?s=612x612&w=0&k=20&c=0nuLvsWKXPReu01RvbXTKIwlUYxOQvoXD_qVBrsapxc=" },
  { img: "https://i.pinimg.com/736x/82/4c/75/824c75d5d8baddac1e3ab99a48b77f36.jpg" }
];

export const getServerSideProps = async (context: GetServerSideProps) => {
  return {
    props: {}
  };
};
