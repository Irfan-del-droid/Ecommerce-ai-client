import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="fb-logo">
            <span className="fb-rune">ᛚ</span>
            <div>
              <div className="fb-name">LOKI STORES</div>
              <div className="fb-tag">Dress Like a God</div>
            </div>
          </div>
          <p className="fb-about">Premium men's fashion inspired by Norse mythology. Crafted for the modern warrior.</p>
          <div className="fb-socials">
            {[["I","Instagram"],["T","Twitter"],["P","Pinterest"],["Y","YouTube"]].map(([l,n]) => (
              <a key={n} href="#!" className="fb-soc" title={n}>{l}</a>
            ))}
          </div>
        </div>
        <div className="footer-cols">
          {[
            { h:"Shop",    ls:[
              { label:"New Arrivals", path:"/#collections" },
              { label:"Clothing",     path:"/#collections" },
              { label:"Footwear",     path:"/#collections" },
              { label:"Accessories",  path:"/#collections" },
              { label:"Grooming",     path:"/#collections" },
            ]},
            { h:"Support", ls:[
              { label:"FAQ",             path:"/#contact" },
              { label:"Shipping Policy", path:"/#contact" },
              { label:"Returns",         path:"/#contact" },
              { label:"Track Order",     path:"/#contact" },
              { label:"Contact",         path:"/#contact" },
            ]},
            { h:"Company", ls:[
              { label:"About Us",  path:"/#about" },
              { label:"Careers",   path:"/#about" },
              { label:"Press",     path:"/#about" },
              { label:"Blog",      path:"/#about" },
              { label:"Affiliate", path:"/#about" },
            ]},
          ].map(col => (
            <div key={col.h} className="fc-col">
              <div className="fc-h">{col.h}</div>
              {col.ls.map(l => <a key={l.label} href={l.path} className="fc-link">{l.label}</a>)}
            </div>
          ))}
        </div>
      </div>
      <div className="footer-bar">
        <span>© 2024 Loki Stores. All rights reserved.</span>
        <div className="footer-rune-row">
          {["ᚠ","ᚢ","ᚦ","ᚨ","ᚱ"].map((r,i) => (
            <span key={i} className="fr-r" style={{ animationDelay:`${i*0.28}s` }}>{r}</span>
          ))}
        </div>
        <span>Made with ♥ for the modern king</span>
      </div>
    </footer>
  );
}
