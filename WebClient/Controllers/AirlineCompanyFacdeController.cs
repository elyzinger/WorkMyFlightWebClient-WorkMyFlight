﻿
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WorkMyFlight;

namespace FlightRestWeb.Controllers
{
    [JwtAuthentication]
    public class AirlineCompanyFacdeController : ApiController
    {
        private FlyingCenterSystem FCS;
        private LoginToken<AirLineCompany> airlineT;
        private LoggedInAirlineFacade  airlineF;

        private void GetLoginToken()
        {
            Request.Properties.TryGetValue("token", out object loginToken);

            airlineT = loginToken as LoginToken<AirLineCompany>;
        }
        [HttpGet]
        public IHttpActionResult GetLandingNow()
        {
            FCS = FlyingCenterSystem.GetInstance();
            IAnonymousUserFacade af = FCS.GetFacade(null) as AnonymousUserFacade;
            IList<Flight> flighs = (List<Flight>)af.GetArrivingNow();
            if (flighs.Count == 0)
                return NotFound();
            return Ok(flighs);
        }
    }
}
