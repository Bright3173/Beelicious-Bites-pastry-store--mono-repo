'use client';

import React, { useState } from 'react';
import { Fade } from 'react-awesome-reveal';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import useSWR from 'swr';
import { Row } from 'react-bootstrap';
import fetcher from '../fetcher/Fetcher';
import ProductItemCard from '../item/ProductItemCard';

const NewArrivals = ({ onSuccess = () => {}, onError = () => {} }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const Categories = [
    {
      groupname: 'Banana',
      categoryName: ['Banana', 'Epicurious', 'Buttermilk', 'Walnut'],
    },
    {
      groupname: 'Chocolaty',
      categoryName: ['chocolate ', 'Chocolaty Biscuit', 'Chocolaty'],
    },
    {
      groupname: 'Nut',
      categoryName: ['Nut', 'Coconut', 'Cashew'],
    },
  ];

  const { data, error } = useSWR('/api/all-product', fetcher, {
    onSuccess,
    onError,
  });

  if (error) return <div>Failed to load products</div>;
  if (!data) return <div />;

  const filterByAll = () => {
    return data
      .map((item: any) => ({ item, sort: Math.random() }))
      .sort((a: any, b: any) => a.sort - b.sort)
      .map(({ item }: any) => item)
      .slice(0, 12);
  };

  const filterByCategory = (category: string) => {
    return data.filter((product: any) =>
      Categories.find(
        (cat) =>
          cat.groupname === category &&
          cat.categoryName.includes(product.category)
      )
    );
  };

  return (
    <section className="section-product-tabs padding-tb-50">
      <div className="container">
        <Tabs>
          {/* ================= TITLE & TABS ================= */}
          <Row className="g-4">
            <div className="col-12">
              <Fade triggerOnce direction="up" duration={1000}>
                <div className="section-title bb-deal">
                  <div className="section-detail">
                    <h2 className="bb-title">
                      <span style={{ color: '#FFE8B3' }}>Explore</span> Our
                      Bread Selection
                    </h2>
                    <p>
                      Freshly baked bread made with care, softness and rich
                      <br />
                      flavor in every bite
                    </p>
                  </div>

                  <TabList className="bb-pro-tab mb-3">
                    <ul className="bb-pro-tab-nav nav">
                      {['All', 'Banana', 'Chocolaty', 'Nut'].map((tab, idx) => (
                        <Tab
                          key={tab}
                          className="nav-item"
                          style={{ outline: 'none' }}
                        >
                          <a
                            className={`nav-link ${
                              selectedIndex === idx ? 'active' : ''
                            }`}
                            onClick={() => setSelectedIndex(idx)}
                          >
                            {tab}
                          </a>
                        </Tab>
                      ))}
                    </ul>
                  </TabList>
                </div>
              </Fade>
            </div>
          </Row>

          {/* ================= PRODUCTS ================= */}
          <Row className="mb-minus-24">
            <div className="col-12">
              <div className="tab-content">
                {/* -------- ALL PRODUCTS -------- */}
                <TabPanel
                  className={`tab-pane fade ${
                    selectedIndex === 0 ? 'show active' : ''
                  }`}
                >
                  <Row className="gx-4 gy-4">
                    {filterByAll().map((item: any, index: number) => (
                      <Fade
                        key={index}
                        triggerOnce
                        direction="up"
                        duration={1000}
                        className="col-6 col-lg-3 mb-4 bb-product-box"
                      >
                        <ProductItemCard data={item} />
                      </Fade>
                    ))}
                  </Row>
                </TabPanel>

                {/* -------- CATEGORY PRODUCTS -------- */}
                {Categories.map((category, idx) => (
                  <TabPanel
                    key={category.groupname}
                    className={`tab-pane fade ${
                      selectedIndex === idx + 1 ? 'show active' : ''
                    }`}
                  >
                    <Row className="gx-4 gy-4">
                      {filterByCategory(category.groupname).map(
                        (product: any, index: number) => (
                          <Fade
                            key={index}
                            triggerOnce
                            direction="up"
                            duration={1000}
                            className="col-6 col-lg-3 bb-product-box"
                          >
                            <ProductItemCard data={product} />
                          </Fade>
                        )
                      )}
                    </Row>
                  </TabPanel>
                ))}
              </div>
            </div>
          </Row>
        </Tabs>
      </div>
    </section>
  );
};

export default NewArrivals;
